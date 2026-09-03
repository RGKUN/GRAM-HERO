// GRAM AFK HEROES - Battle System

class BattleSystem {
  constructor(party, stage, bossIndex) {
    this.party = party.filter(h => h.isAlive);
    this.allParty = party;
    this.stage = stage;
    this.bossIndex = bossIndex;
    this.currentWave = 0;
    this.totalWaves = CONFIG.battle.waveCount;
    this.enemies = [];
    this.turn = 0;
    this.autoBattle = true;
    this.battleSpeed = 1;
    this.state = 'WAVE_INTRO';
    this.rewards = { xp: 0, gold: 0, diamond: 0, items: [] };
    this.damageNumbers = [];
    this.effects = [];
    this.battleLog = [];
    this.turnTimer = 0;
    this.turnDelay = 60;
    this.isVictory = false;
    this.isDefeat = false;
    this.battleStarted = false;
    this.bossDefeated = false;
    this.waveComplete = false;
    this.totalKills = 0;
    this.bossAppearTimer = 0;
    
    this.startWave();
  }

  startWave() {
    this.enemies = generateWave(this.stage, this.currentWave, this.totalWaves);
    this.state = 'WAVE_INTRO';
    this.turnTimer = 0;
    this.battleLog.push(`Wave ${this.currentWave + 1}`);
    events.emit('battle_wave', { wave: this.currentWave + 1, total: this.totalWaves });
  }

  startBoss() {
    this.enemies = [generateBoss(this.stage, this.bossIndex)];
    this.state = 'BOSS_INTRO';
    this.bossAppearTimer = 60;
    this.battleLog.push(`BOSS: ${this.enemies[0].name}!`);
    events.emit('battle_boss', { boss: this.enemies[0].name });
  }

  update() {
    if (this.isVictory || this.isDefeat) return;

    this.turnTimer++;
    const delay = Math.floor(this.turnDelay / this.battleSpeed);
    
    if (this.state === 'BOSS_INTRO') {
      this.bossAppearTimer--;
      if (this.bossAppearTimer <= 0) {
        this.state = 'BATTLE';
      }
      return;
    }

    if (this.state !== 'BATTLE') {
      if (this.turnTimer > 30) {
        this.state = 'BATTLE';
      }
      return;
    }

    if (this.turnTimer < delay) return;
    this.turnTimer = 0;

    // Hero actions
    this.party.forEach((hero, i) => {
      if (!hero.isAlive) return;
      hero.tickCooldowns();
      
      // Energy from basic attack
      hero.addEnergy(3);
      
      // Target selection - hero attacks first enemy
      const target = this.enemies.find(e => e.isAlive);
      if (!target) return;

      // Skill usage (auto battle AI)
      let usedSkill = null;
      
      if (hero.useEnergy()) {
        // Use Ultimate
        const ult = hero.skills[2];
        if (ult && ult.type === 'ultimate') {
          usedSkill = hero.useSkill(2) || hero.skills[2];
          if (hero.classType === 'HEALER') {
            this.healAllHeroes(usedSkill.power * hero.healPower);
          } else if (usedSkill.power >= 4.0) {
            // AoE ultimate
            this.enemies.forEach(e => {
              if (e.isAlive) {
                const dmg = this.calcDamage(hero, e, usedSkill.power);
                const actualDmg = e.takeDamage(dmg);
                this.addDamageNumber(e, actualDmg, true);
              }
            });
          } else {
            const dmg = this.calcDamage(hero, target, usedSkill.power);
            const actualDmg = target.takeDamage(dmg);
            this.addDamageNumber(target, actualDmg, true);
          }
          this.addEffect('ultimate', hero);
          return;
        }
      }

      // Regular skill
      for (let s = 0; s < 2; s++) {
        if (hero.canUseSkill(s)) {
          const skill = hero.useSkill(s);
          if (skill) {
            usedSkill = skill;
            if (skill.type === 'heal') {
              const weakest = this.party.filter(h => h.isAlive).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
              if (weakest && weakest.hp / weakest.maxHp < 0.7) {
                const healAmt = Math.floor(skill.power * hero.healPower);
                const healed = weakest.heal(healAmt);
                this.addHealNumber(weakest, healed);
              } else {
                hero.cooldowns[s] = 0;
              }
            } else if (skill.type === 'shield') {
              this.party.forEach(h => {
                if (h.isAlive) h.defBuff += Math.floor(h.def * 0.3);
              });
            } else {
              const dmg = this.calcDamage(hero, target, skill.power);
              const actualDmg = target.takeDamage(dmg);
              this.addDamageNumber(target, actualDmg, false);
            }
            break;
          }
        }
      }

      // Basic attack
      if (!usedSkill) {
        const dmg = this.calcDamage(hero, target, 1.0);
        const actualDmg = target.takeDamage(dmg);
        const isCrit = Math.random() * 100 < hero.critRate;
        if (isCrit) {
          const critDmg = Math.floor(dmg * hero.critDmg);
          const actualCritDmg = target.takeDamage(critDmg - dmg);
          this.addDamageNumber(target, actualDmg + actualCritDmg, true);
        } else {
          this.addDamageNumber(target, actualDmg, false);
        }
      }
    });

    // Check enemy deaths
    this.enemies.forEach(e => {
      if (!e.isAlive && e.hp === 0 && !e._counted) {
        e._counted = true;
        this.rewards.xp += e.xpReward;
        this.rewards.gold += e.goldReward;
        this.totalKills++;
        this.addEffect('death', e);
      }
    });

    // Boss mechanic
    const boss = this.enemies.find(e => e.isBoss && e.isAlive);
    if (boss && this.turn % 3 === 0) {
      const mechEffects = boss.applyMechanic(this.enemies);
      mechEffects.forEach(e => this.effects.push({ ...e, timer: 30 }));
    }

    // Enemy attacks
    this.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;
      
      const targets = this.party.filter(h => h.isAlive && h.position === 'FRONT');
      const targetList = targets.length > 0 ? targets : this.party.filter(h => h.isAlive);
      if (targetList.length === 0) return;
      
      const target = targetList[Utils.rand(0, targetList.length - 1)];
      
      // Damage from mechanics
      let dmg = enemy.atk;
      if (enemy.mech === 'poison') dmg += enemy.poisonDmg;
      
      const actualDmg = target.takeDamage(dmg);
      this.addDamageNumber(target, actualDmg, false);
      this.addEffect('enemy_attack', { x: target });
      
      // Lifesteal
      if (enemy.mech === 'lifesteal') {
        enemy.hp = Math.min(enemy.hp + Math.floor(actualDmg * 0.2), enemy.maxHp);
      }
    });

    // Clean up def buffs
    this.party.forEach(h => { h.defBuff = 0; });

    // Check battle end
    const allEnemiesDead = this.enemies.every(e => !e.isAlive);
    const allHeroesDead = this.party.every(h => !h.isAlive);

    if (allHeroesDead) {
      this.isDefeat = true;
      this.state = 'DEFEAT';
      events.emit('battle_end', { result: 'DEFEAT' });
      return;
    }

    if (allEnemiesDead) {
      if (this.bossDefeated) {
        this.isVictory = true;
        this.state = 'VICTORY';
        events.emit('battle_end', { result: 'VICTORY', rewards: this.rewards });
        return;
      }
      
      this.currentWave++;
      if (this.currentWave >= this.totalWaves) {
        this.startBoss();
      } else {
        this.startWave();
      }
    }

    this.turn++;
  }

  calcDamage(hero, enemy, powerMul) {
    const baseDmg = hero.atk * powerMul;
    return Math.max(1, Math.floor(baseDmg * 100 / (100 + enemy.def)));
  }

  healAllHeroes(amount) {
    this.party.forEach(h => {
      if (h.isAlive) {
        const healed = h.heal(amount);
        if (healed > 0) this.addHealNumber(h, healed);
      }
    });
  }

  addDamageNumber(target, amount, isCrit) {
    const x = target._drawX || 0;
    const y = target._drawY || 0;
    this.damageNumbers.push({
      text: isCrit ? `CRIT! ${amount}` : `-${amount}`,
      x: x + Utils.rand(-10, 10),
      y: y - 20,
      color: isCrit ? '#f1c40f' : '#fff',
      size: isCrit ? 16 : 12,
      life: 40,
      vy: -1
    });
  }

  addHealNumber(target, amount) {
    const x = target._drawX || 0;
    const y = target._drawY || 0;
    this.damageNumbers.push({
      text: `+${amount}`,
      x: x + Utils.rand(-10, 10),
      y: y - 20,
      color: '#2ecc71',
      size: 12,
      life: 40,
      vy: -1
    });
  }

  addEffect(type, source) {
    this.effects.push({
      type,
      x: source._drawX || 0,
      y: source._drawY || 0,
      timer: 20,
      color: source.color || '#fff'
    });
  }

  updateNumbers() {
    this.damageNumbers = this.damageNumbers.filter(n => {
      n.y += n.vy;
      n.life--;
      return n.life > 0;
    });
    this.effects = this.effects.filter(e => {
      e.timer--;
      return e.timer > 0;
    });
  }

  drawBattle(ctx, W, H) {
    // Clear
    if (window.game && window.game.assets && window.game.assets.bgStage && window.game.assets.bgStage.complete) {
      ctx.drawImage(window.game.assets.bgStage, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);
    }

    // Draw stage info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Stage ${this.stage} | Wave ${this.currentWave + 1}/${this.totalWaves}`, 10, 20);

    // Draw heroes (left side)
    const heroStartY = H * 0.3;
    const heroSpacing = 80;
    this.allParty.forEach((hero, i) => {
      const x = W * 0.2;
      const y = heroStartY + i * heroSpacing;
      hero._drawX = x;
      hero._drawY = y;
      hero.draw(ctx, x, y, 45);
    });

    // Draw enemies (right side)
    const aliveEnemies = this.enemies.filter(e => e.isAlive);
    const enemyStartY = H * 0.3;
    const enemySpacing = Math.min(80, (H * 0.5) / Math.max(aliveEnemies.length, 1));
    aliveEnemies.forEach((enemy, i) => {
      const x = W * 0.75;
      const y = enemyStartY + i * enemySpacing;
      enemy._drawX = x;
      enemy._drawY = y;
      enemy.draw(ctx, x, y, enemy.isBoss ? 55 : 35);
    });

    // Damage numbers
    this.damageNumbers.forEach(n => {
      ctx.globalAlpha = Math.min(1, n.life / 20);
      ctx.fillStyle = n.color;
      ctx.font = `bold ${n.size}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(n.text, n.x, n.y);
    });
    ctx.globalAlpha = 1;

    // Effects
    this.effects.forEach(e => {
      ctx.globalAlpha = e.timer / 20;
      if (e.type === 'death') {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 30 - e.timer, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'ultimate') {
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 20 + e.timer, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'enemy_attack') {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(e.x - 15, e.y - 15, 30, 30);
      } else if (e.type === 'boss_shield') {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.strokeRect(e.x - 30, e.y - 30, 60, 60);
      }
    });
    ctx.globalAlpha = 1;

    // Wave intro text
    if (this.state === 'WAVE_INTRO') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, H/2 - 40, W, 80);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`WAVE ${this.currentWave + 1}`, W/2, H/2 + 8);
    }

    // Boss intro
    if (this.state === 'BOSS_INTRO') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, H/2 - 50, W, 100);
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ BOSS ⚠', W/2, H/2 - 5);
      ctx.font = '16px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(this.enemies[0]?.name || 'Unknown', W/2, H/2 + 25);
    }

    // Victory
    if (this.isVictory) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VICTORY!', W/2, H/2 - 60);
      ctx.font = '16px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText(`+${this.rewards.xp} XP`, W/2, H/2 - 20);
      ctx.fillText(`+${this.rewards.gold} Gold`, W/2, H/2 + 10);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Tap to continue', W/2, H/2 + 50);
    }

    // Defeat
    if (this.isDefeat) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DEFEAT', W/2, H/2 - 40);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#ccc';
      ctx.fillText('Your heroes were defeated', W/2, H/2);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Tap to retry', W/2, H/2 + 40);
    }
  }
}
