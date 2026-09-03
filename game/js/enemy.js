// GRAM AFK HEROES - Enemy System (Koroco & Boss)

class Enemy {
  constructor(type, scale = 1, isBoss = false, bossIndex = 0) {
    this.isBoss = isBoss;
    this.isKoroco = !isBoss;
    
    if (isBoss) {
      const b = CONFIG.bosses[bossIndex];
      this.name = b.name;
      this.color = b.color;
      this.mech = b.mech;
      this.maxHp = Math.floor(b.hp * scale);
      this.atk = Math.floor(b.atk * scale);
      this.def = Math.floor(b.def * scale);
      this.xpReward = Math.floor(CONFIG.economy.bossXp[0] * (1 + bossIndex * 0.3) * scale);
      this.goldReward = Math.floor(CONFIG.economy.bossGold[0] * (1 + bossIndex * 0.3) * scale);
    } else {
      const k = CONFIG.koroco[type];
      this.name = k.name;
      this.color = k.color;
      this.mech = null;
      this.maxHp = Math.floor(k.hp * scale);
      this.atk = Math.floor(k.atk * scale);
      this.def = Math.floor(k.def * scale);
      this.xpReward = Math.floor(Utils.rand(CONFIG.economy.korocoXp[0], CONFIG.economy.korocoXp[1]) * scale);
      this.goldReward = Math.floor(Utils.rand(CONFIG.economy.korocoGold[0], CONFIG.economy.korocoGold[1]) * scale);
    }
    
    this.hp = this.maxHp;
    this.isAlive = true;
    this.shield = 0;
    this.rageActive = false;
    this.poisonDmg = 0;
    this.burnDmg = 0;
    this.id = Utils.generateUUID();
  }

  takeDamage(dmg) {
    const mitigated = Math.max(1, Math.floor(dmg * 100 / (100 + this.def)));
    
    // Shield boss mechanic
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, mitigated);
      this.shield -= absorbed;
      return Math.max(0, mitigated - absorbed);
    }
    
    this.hp -= mitigated;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
    }
    
    // Rage mechanic
    if (this.mech === 'rage' && this.hp / this.maxHp < 0.3 && !this.rageActive) {
      this.atk = Math.floor(this.atk * 1.5);
      this.rageActive = true;
    }
    
    // Berserk mechanic
    if (this.mech === 'berserk' && this.hp / this.maxHp < 0.3) {
      this.atk = Math.floor(this.atk * 1.1);
    }
    
    return mitigated;
  }

  applyMechanic(enemies) {
    const effects = [];
    if (!this.isBoss || !this.isAlive) return effects;
    
    switch (this.mech) {
      case 'shield':
        this.shield = Math.floor(this.maxHp * 0.2);
        effects.push({ type: 'boss_shield', value: this.shield });
        break;
      case 'summon':
        if (enemies.filter(e => e.isKoroco && e.isAlive).length < 4) {
          const k = new Enemy('NORMAL', 0.8);
          enemies.push(k);
          effects.push({ type: 'boss_summon', name: k.name });
        }
        break;
      case 'healer':
        const damaged = enemies.filter(e => e.isAlive && e.hp < e.maxHp);
        if (damaged.length > 0) {
          const target = damaged[0];
          const heal = Math.floor(target.maxHp * 0.1);
          target.hp = Math.min(target.hp + heal, target.maxHp);
          effects.push({ type: 'boss_heal', target: target.name, value: heal });
        }
        break;
      case 'poison':
        this.poisonDmg = Math.floor(this.atk * 0.1);
        break;
    }
    return effects;
  }

  draw(ctx, x, y, size) {
    if (!this.isAlive) return;
    const s = this.isBoss ? size * 1.5 : size;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 4, s * 0.6, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillStyle = this.color;
    ctx.fillRect(x - s/2, y - s, s, s);
    
    // Boss glow
    if (this.isBoss) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x - s/2 - 4, y - s - 4, s + 8, s + 8);
    }
    
    // Eyes
    ctx.fillStyle = this.isBoss ? '#f1c40f' : '#fff';
    ctx.fillRect(x - s * 0.2, y - s * 0.7, s * 0.12, s * 0.12);
    ctx.fillRect(x + s * 0.08, y - s * 0.7, s * 0.12, s * 0.12);
    
    // Shield
    if (this.shield > 0) {
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - s/2 - 6, y - s - 6, s + 12, s + 12);
    }
    
    // HP bar
    const barW = s;
    const barH = this.isBoss ? 8 : 5;
    const barX = x - barW/2;
    const barY = y - s - (this.isBoss ? 16 : 10);
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    const hpPct = this.hp / this.maxHp;
    ctx.fillStyle = hpPct > 0.5 ? '#e74c3c' : hpPct > 0.25 ? '#e67e22' : '#c0392b';
    ctx.fillRect(barX, barY, barW * hpPct, barH);
    
    // Name
    ctx.fillStyle = this.isBoss ? '#f1c40f' : '#ccc';
    ctx.font = this.isBoss ? 'bold 12px monospace' : '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x, y - s - (this.isBoss ? 20 : 14));
  }
}

// Wave Generator
function generateWave(stage, waveNum, totalWaves) {
  const enemies = [];
  const types = Object.keys(CONFIG.koroco);
  const count = CONFIG.battle.minKorocoPerWave[Math.min(waveNum, CONFIG.battle.minKorocoPerWave.length - 1)];
  const scale = 1 + (stage - 1) * 0.15 + waveNum * 0.1;
  
  for (let i = 0; i < count; i++) {
    const type = types[Utils.rand(0, types.length - 1)];
    enemies.push(new Enemy(type, scale));
  }
  
  return enemies;
}

function generateBoss(stage, bossIndex) {
  const scale = 1 + (stage - 1) * 0.2;
  return new Enemy(null, scale, true, bossIndex);
}
