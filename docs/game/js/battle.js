class BattleSystem {
  playSfx(key) {
    try {
      const g=window.game;
      if(g&&g.sfx&&g.sfx[key]) {
        const a=g.sfx[key];
        a.currentTime=0;
        const p=a.play();
        if(p&&p.catch) p.catch(()=>{});
      }
    } catch(e) {}
  }
  constructor(party, stage, bossIndex) {
    this.party = party.filter(h=>h.isAlive);
    this.allParty = party;
    this.stage = stage;
    this.bossIndex = bossIndex;
    this.currentWave = 0;
    this.totalWaves = CONFIG.battle.waveCount;
    this.enemies = [];
    this.turn = 0;
    this.screenShake = 0;
    this.heroLunge = {}; // hero index -> lunge timer
    this.enemyRecoil = {}; // enemy index -> recoil timer
    this.autoBattle = true;
    this.battleSpeed = 1;
    this.state = 'WAVE_INTRO';
    this.rewards = { xp:0, gold:0 };
    this.damageNumbers = [];
    this.effects = [];
    this.battleLog = [];
    this.turnTimer = 0;
    this.turnDelay = 65;
    this.isVictory = false;
    this.isDefeat = false;
    this.bossDefeated = false;
    this.totalKills = 0;
    this.bossAppearTimer = 0;
    this.startWave();
  }
  startWave() {
    this.enemies = generateWave(this.stage, this.currentWave);
    this.state = 'WAVE_INTRO';
    this.turnTimer = 0;
  }
  startBoss() {
    this.enemies = [generateBoss(this.stage, this.bossIndex)];
    this.state = 'BOSS_INTRO';
    this.bossAppearTimer = 50;
  }
  update() {
    if (this.isVictory||this.isDefeat) return;
    this.turnTimer++;
    if (this.state==='BOSS_INTRO') { this.bossAppearTimer--; if(this.bossAppearTimer<=0) this.state='BATTLE'; return; }
    if (this.state!=='BATTLE') { if(this.turnTimer>60) { this.state='BATTLE'; this.allParty.forEach(h=>{ if(h.isAlive) h.setAction('idle'); }); } return; }
    if (this.turnTimer < Math.floor(this.turnDelay/this.battleSpeed)) return;
    this.turnTimer = 0;

    this.party.forEach(hero => {
      if (!hero.isAlive) return;
      hero.tickCooldowns();
      hero.addEnergy(3);
      hero.setAction('attack');
      this.heroLunge[hero.id] = 8;
      const target = this.enemies.find(e=>e.isAlive);
      if (!target) return;
      let usedSkill = null;

      if (hero.useEnergy()) {
        const ult = hero.skills[2];
        if (ult && ult.type==='ultimate') {
          usedSkill = true;
          if (hero.classType==='HEALER') {
            this.party.forEach(h=>{ if(h.isAlive){ const hl=h.heal(Math.floor(ult.power*hero.healPower)); if(hl>0) this.addNum(h,'+'+hl,'#2ecc71',14); }});
          } else {
            this.playSfx('sword_3');
            this.enemies.forEach(e=>{ if(e.isAlive){ const d=this.calcDmg(hero,e,ult.power); const a=e.takeDamage(d); this.addNum(e,'-'+a,'#f1c40f',16); this.addFx('ult',e); }});
          }
          return;
        }
      }
      for (let s=0;s<2;s++) {
        if (hero.canUseSkill(s)) {
          const skill = hero.useSkill(s);
          if (skill) {
            usedSkill = true;
            if (skill.type==='heal') {
              const weak = this.party.filter(h=>h.isAlive).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
              if (weak && weak.hp/weak.maxHp<0.7) {
                const hl = weak.heal(Math.floor(skill.power*hero.healPower));
                this.addNum(weak,'+'+hl,'#2ecc71',13);
              } else hero.cooldowns[s]=0;
            } else if (skill.type==='shield') {
              this.party.forEach(h=>{ if(h.isAlive) h.defBuff+=Math.floor(h.def*0.3); });
            } else {
              this.playSfx('sword_2');
              const d=this.calcDmg(hero,target,skill.power);
              const a=target.takeDamage(d); this.screenShake=4;
              this.addNum(target,'-'+a,'#ff8a65',13);
            }
            break;
          }
        }
      }
      if (!usedSkill) {
        this.playSfx('sword_1');
        const d=this.calcDmg(hero,target,1.0);
        const isCrit = Math.random()*100 < hero.critRate;
        let a = target.takeDamage(d);
        if (isCrit) {
          const cd = Math.floor(d*hero.critDmg);
          a = target.takeDamage(cd-d); this.screenShake=6;
          this.addNum(target,'-'+(d+a),'#f1c40f',15);
          this.addFx('crit',target);
        } else {
          this.addNum(target,'-'+a,'#ffffff',11);
          this.addFx('hit',target);
        }
      }
    });

    this.enemies.forEach(e=>{
      if (!e.isAlive && !e._counted) { e._counted=true; this.rewards.xp+=e.xp; this.rewards.gold+=e.gold; this.totalKills++; this.addFx('death',e); }
    });

    const boss = this.enemies.find(e=>e.isBoss&&e.isAlive);
    if (boss && this.turn%3===0) boss.applyMechanic(this.enemies);

    this.enemies.forEach(enemy=>{
      if (!enemy.isAlive) return;
      const front = this.party.filter(h=>h.isAlive&&h.position==='FRONT');
      const targets = front.length>0 ? front : this.party.filter(h=>h.isAlive);
      if (targets.length===0) return;
      const target = targets[Utils.rand(0,targets.length-1)];
      const a = target.takeDamage(enemy.atk);
      this.addNum(target,'-'+a,'#e74c3c',11);
      if (enemy.mech==='lifesteal') enemy.hp=Math.min(enemy.hp+Math.floor(a*0.2),enemy.maxHp);
    });

    this.party.forEach(h=>{ h.defBuff=0; });

    if (this.party.every(h=>!h.isAlive)) { this.isDefeat=true; this.state='DEFEAT'; events.emit('battle_end',{result:'DEFEAT'}); return; }
    if (this.enemies.every(e=>!e.isAlive)) {
      if (this.bossDefeated) { this.isVictory=true; this.state='VICTORY'; events.emit('battle_end',{result:'VICTORY',rewards:this.rewards}); return; }
      this.currentWave++;
      if (this.currentWave>=this.totalWaves) this.startBoss(); else this.startWave();
    }
    this.turn++;
  }
  calcDmg(hero,enemy,power) {
    return Math.max(1, Math.floor(hero.atk*power*100/(100+enemy.def)));
  }
  addNum(target,text,color,size) {
    // Trigger enemy recoil + lighter screen shake on any damage
    if (target && this.enemies.includes(target)) {
      const idx = this.enemies.indexOf(target);
      if (idx >= 0) { if (!this.enemyRecoil[idx]) this.enemyRecoil[idx]=6; }
    }
    this.screenShake = Math.max(this.screenShake, 2);
    this.damageNumbers.push({ text, x:(target._dx||0)+Utils.rand(-8,8), y:(target._dy||0)-20, color, size, life:35, vy:-0.8 });
  }
  addFx(type,source) {
    this.effects.push({ type, x:source._dx||0, y:source._dy||0, timer:20, color:source.colors?.body||'#fff' });
  }
  updateFx() {
    this.damageNumbers = this.damageNumbers.filter(n=>{ n.y+=n.vy; n.life--; return n.life>0; });
    this.effects = this.effects.filter(e=>{ e.timer--; return e.timer>0; });
    if (this.screenShake > 0) this.screenShake--;
    for (const k in this.heroLunge) { if (this.heroLunge[k] > 0) this.heroLunge[k]--; }
    for (const k in this.enemyRecoil) { if (this.enemyRecoil[k] > 0) this.enemyRecoil[k]--; }
  }
  drawBattle(ctx, W, H) {
    // BG image full (no ground overlay)
    if (window.game && window.game.assets && window.game.assets.bgStage) {
      ctx.drawImage(window.game.assets.bgStage, 0, 0, W, H);
      ctx.fillStyle='rgba(0,0,0,0.35)';
      ctx.fillRect(0,0,W,H);
    } else {
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'#0d1117');
      bg.addColorStop(0.4,'#161b22');
      bg.addColorStop(1,'#0d1117');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,W,H);
    }

    // Stage info (top bar)
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(0,0,W,22);
    ctx.fillStyle='#f1c40f';
    ctx.font='bold 10px monospace';
    ctx.textAlign='left';
    ctx.fillText(`Stage ${this.stage} | Wave ${Math.min(this.currentWave+1,this.totalWaves)}/${this.totalWaves}`, 8, 15);
    ctx.fillStyle='#6b7280'; ctx.textAlign='right';
    ctx.fillText(`Turn ${this.turn}`, W-8, 15);

    // Smooth walk: ease-in-out interpolation
    const centerX = W/2;
    const fightY = H*0.55;
    const walkDur = 60; // frames for full walk
    let t = this.state==='WAVE_INTRO' || this.state==='BOSS_INTRO' ? Math.min(1, this.turnTimer/walkDur) : 1;
    // easeInOutCubic
    t = t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

    // Screen shake
    const shkX = this.screenShake > 0 ? (Math.random()-0.5)*this.screenShake*2 : 0;
    const shkY = this.screenShake > 0 ? (Math.random()-0.5)*this.screenShake*2 : 0;
    ctx.save();
    ctx.translate(shkX, shkY);

    // Heroes (left side, walk right toward center)
    this.allParty.forEach((hero,i)=>{
      const startX = W*0.08 + i*55;
      const endX = centerX - 60 - (this.allParty.length-1-i)*52;
      const x = startX + (endX - startX) * t;
      const startY = fightY + 30 + i*20;
      const endY = fightY + (hero.position==='FRONT'?20:45) - i*10;
      const y = startY + (endY - startY) * t;
      // Lunge forward when attacking
      const lunge = (this.heroLunge[hero.id]||0);
      const lungeX = lunge > 4 ? (8-lunge)*12 : lunge > 0 ? lunge*12 : 0;
      hero._dx=x+lungeX; hero._dy=y;
      hero.draw(ctx,x+lungeX,y,65);
    });

    // Enemies (right side, walk left toward center)
    const aliveE = this.enemies.filter(e=>e.isAlive);
    aliveE.forEach((enemy,i)=>{
      const startX = W*0.92 - i*55;
      const endX = centerX + 60 + i*52;
      const x = startX + (endX - startX) * t;
      const startY = fightY + (enemy.isBoss?-20:20) + i*15;
      const endY = fightY + (enemy.isBoss?-20:20) + i*10;
      const y = startY + (endY - startY) * t;
      // Recoil when hit
      const recoil = (this.enemyRecoil[i]||0);
      const recoilX = recoil > 0 ? recoil * 4 : 0;
      enemy._dx=x+recoilX; enemy._dy=y;
      enemy.draw(ctx,x+recoilX,y,enemy.isBoss?70:50);
    });

    ctx.restore(); // End shake transform

    // Damage numbers
    this.damageNumbers.forEach(n=>{
      ctx.globalAlpha = Math.min(1, n.life/15);
      ctx.fillStyle = n.color;
      ctx.font = `bold ${n.size}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(n.text, n.x, n.y);
    });
    ctx.globalAlpha = 1;

    // Effects
    this.effects.forEach(e=>{
      ctx.globalAlpha = e.timer/20;
      if (e.type==='death') {
        const g = ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,30-e.timer);
        g.addColorStop(0,e.color); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(e.x,e.y,30-e.timer,0,Math.PI*2); ctx.fill();
      } else if (e.type==='ult') {
        const g = ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,25);
        g.addColorStop(0,'#f1c40f'); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(e.x,e.y,25,0,Math.PI*2); ctx.fill();
      } else if (e.type==='crit') {
        ctx.fillStyle='#f1c40f';
        for(let i=0;i<6;i++) {
          const a=Math.random()*Math.PI*2, r=10+Math.random()*15;
          ctx.fillRect(e.x+Math.cos(a)*r-2, e.y+Math.sin(a)*r-2, 4, 4);
        }
      } else if (e.type==='hit') {
        ctx.fillStyle='#ffffff';
        ctx.beginPath(); ctx.arc(e.x,e.y,8,0,Math.PI*2); ctx.fill();
      }
    });
    ctx.globalAlpha = 1;

    // Overlays
    if (this.state==='WAVE_INTRO') {
      ctx.fillStyle='rgba(0,0,0,0.8)';
      ctx.beginPath(); ctx.roundRect(W*0.15, 28, W*0.7, 36, 8); ctx.fill();
      ctx.strokeStyle='#f1c40f'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(W*0.15, 28, W*0.7, 36, 8); ctx.stroke();
      ctx.lineWidth=1;
      ctx.fillStyle='#f1c40f'; ctx.font='bold 16px monospace'; ctx.textAlign='center';
      ctx.fillText(`⚔ WAVE ${this.currentWave+1}`, W/2, 52);
    }
    if (this.state==='BOSS_INTRO') {
      ctx.fillStyle='rgba(139,0,0,0.85)';
      ctx.beginPath(); ctx.roundRect(W*0.1, 28, W*0.8, 44, 8); ctx.fill();
      ctx.strokeStyle='#e74c3c'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(W*0.1, 28, W*0.8, 44, 8); ctx.stroke();
      ctx.lineWidth=1;
      ctx.fillStyle='#e74c3c'; ctx.font='bold 14px monospace'; ctx.textAlign='center';
      ctx.fillText('⚠ BOSS ⚠', W/2, 45);
      ctx.fillStyle='#f1c40f'; ctx.font='bold 12px monospace';
      ctx.fillText(this.enemies[0]?.name||'', W/2, 63);
    }
    if (this.isVictory) {
      ctx.fillStyle='rgba(0,0,0,0.65)'; ctx.fillRect(0,0,W,H);
      const g = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,150);
      g.addColorStop(0,'rgba(241,196,15,0.3)'); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#f1c40f'; ctx.font='bold 32px monospace'; ctx.textAlign='center';
      ctx.fillText('VICTORY!', W/2, H/2-50);
      ctx.font='14px monospace'; ctx.fillStyle='#2ecc71';
      ctx.fillText(`+${this.rewards.xp} XP`, W/2, H/2-10);
      ctx.fillStyle='#f1c40f';
      ctx.fillText(`+${this.rewards.gold} Gold`, W/2, H/2+15);
      ctx.font='10px monospace'; ctx.fillStyle='#6b7280';
      ctx.fillText('Tap to continue', W/2, H/2+50);
    }
    if (this.isDefeat) {
      ctx.fillStyle='rgba(0,0,0,0.65)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e74c3c'; ctx.font='bold 32px monospace'; ctx.textAlign='center';
      ctx.fillText('DEFEAT', W/2, H/2-30);
      ctx.font='12px monospace'; ctx.fillStyle='#94a3b8';
      ctx.fillText('Your heroes fell in battle', W/2, H/2+5);
      ctx.fillStyle='#6b7280'; ctx.font='10px monospace';
      ctx.fillText('Tap to retry', W/2, H/2+40);
    }
  }
}
