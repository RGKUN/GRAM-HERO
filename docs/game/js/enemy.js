class Enemy {
  constructor(type, scale=1, isBoss=false, bossIndex=0) {
    this.isBoss = isBoss;
    if (isBoss) {
      const b = CONFIG.bosses[bossIndex];
      this.name = b.name;
      this.colors = b.colors;
      this.mech = b.mech;
      this.maxHp = Math.floor(b.hp*scale);
      this.atk = Math.floor(b.atk*scale);
      this.def = Math.floor(b.def*scale);
      this.xp = Math.floor(500 * (1+bossIndex*0.3) * scale);
      this.gold = Math.floor(200 * (1+bossIndex*0.3) * scale);
    } else {
      const k = CONFIG.slime[type];
      this.name = k.name;
      this.colors = k.colors;
      this.mech = null;
      this.maxHp = Math.floor(k.hp*scale);
      this.atk = Math.floor(k.atk*scale);
      this.def = Math.floor(k.def*scale);
      this.xp = Utils.rand(100, 300)*scale;
      this.gold = Utils.rand(10, 50)*scale;
    }
    this.hp = this.maxHp;
    this.isAlive = true;
    this.shield = 0;
    this.rageAct = false;
    this.animFrame = 0;
    this.animTimer = 0;
    this.animAction = 'idle';
    this.hitFlash = 0;
    this._counted = false;
    this.id = Utils.generateUUID();
  }
  takeDamage(dmg) {
    const mitigated = Math.max(1, Math.floor(dmg*100/(100+this.def)));
    this.hitFlash = 15;
    if (this.shield > 0) { const a=Math.min(this.shield,mitigated); this.shield-=a; return Math.max(0,mitigated-a); }
    this.hp -= mitigated;
    if (this.hp <= 0) { this.hp = 0; this.isAlive = false; }
    if (this.mech==='rage' && this.hp/this.maxHp<0.3 && !this.rageAct) { this.atk = Math.floor(this.atk*1.5); this.rageAct=true; }
    return mitigated;
  }
  setAction(a) { if (this.animAction !== a) { this.animAction = a; this.animFrame = 0; this.animTimer = 0; } }
  applyMechanic(enemies) {
    const fx = [];
    if (!this.isBoss || !this.isAlive) return fx;
    switch(this.mech) {
      case 'shield': this.shield = Math.floor(this.maxHp*0.2); fx.push({type:'shield',t:30}); break;
      case 'summon':
        if (enemies.filter(e=>true&&e.isAlive).length<4) { enemies.push(new Enemy('NORMAL',0.8)); fx.push({type:'summon',t:30}); }
        break;
      case 'healer': {
        const t = enemies.find(e=>e.isAlive&&e.hp<e.maxHp);
        if (t) { t.hp = Math.min(t.hp+Math.floor(t.maxHp*0.1), t.maxHp); fx.push({type:'heal',t:30}); }
        break;
      }
      case 'lifesteal': break;
    }
    return fx;
  }
  draw(ctx, x, y, size) {
    if (!this.isAlive) return;
    const s = size;
    this.animTimer++;
    const g = window.game && window.game.assets;

    // Slime sprites (non-boss)
    if (!this.isBoss && g) {
      // Regular slimes have no attack sprites; treat attack as idle
      const effAction = this.animAction==='attack' ? 'idle' : this.animAction;
      const speed = effAction==='hit'?14:12;
      const maxFrames = effAction==='hit'?2:4;
      if (this.animTimer % speed === 0) {
        this.animFrame++;
        if (effAction === 'hit') {
          if (this.animFrame >= maxFrames) { this.setAction('idle'); this.animFrame = 0; }
        } else {
          this.animFrame = this.animFrame % maxFrames;
        }
      }
      const img = g['slime_'+effAction+'_'+(this.animFrame+1)];
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(x, y+4, s*0.5, s*0.12, 0,0,Math.PI*2); ctx.fill();
      if (img) {
        ctx.drawImage(img, x-s*0.5, y-s*1.2, s, s*1.5);
      } else {
        // Fallback rectangle
        const c = this.colors;
        ctx.fillStyle = c.body;
        ctx.fillRect(x-s*0.35, y-s*0.85, s*0.7, s*0.55);
      }
    } else if (this.isBoss && g) {
      // Giant Slime boss sprites
      const speed = this.animAction==='attack'?10:this.animAction==='hit'?14:12;
      const maxFrames = this.animAction==='attack'?6:this.animAction==='hit'?2:4;
      if (this.animTimer % speed === 0) {
        this.animFrame++;
        if (this.animAction === 'attack' || this.animAction === 'hit') {
          if (this.animFrame >= maxFrames) { this.animAction = 'idle'; this.animFrame = 0; }
        } else {
          this.animFrame = this.animFrame % maxFrames;
        }
      }
      const img = g['giant_'+this.animAction+'_'+(this.animFrame+1)];
      const ss = s * 1.3;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(x, y+4, ss*0.5, ss*0.15, 0,0,Math.PI*2); ctx.fill();
      if (img) {
        ctx.drawImage(img, x-ss*0.5, y-ss*1.2, ss, ss*1.5);
      } else {
        // Fallback rectangle
        const c = this.colors;
        ctx.fillStyle = c.body;
        ctx.fillRect(x-ss*0.35, y-ss*0.85, ss*0.7, ss*0.55);
      }
    } else {
      // Fallback for non-slime non-boss
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(x, y+4, s*0.5, s*0.12, 0,0,Math.PI*2); ctx.fill();
    }

    // Hit flash (subtle tint over sprite footprint, no thick box)
    if (this.hitFlash > 0) {
      const fs = this.isBoss ? s*1.3 : s;
      ctx.fillStyle = `rgba(255,255,255,${this.hitFlash/15*0.30})`;
      ctx.beginPath();
      ctx.ellipse(x, y-fs*0.5, fs*0.42, fs*0.75, 0, 0, Math.PI*2);
      ctx.fill();
      this.hitFlash--;
      if (this.animAction !== 'hit' && this.animAction !== 'attack') this.setAction('hit');
    }
    // Shield (subtle blue tint only, no frame)
    // removed blue border per user request
    // HP bar
    const fs = this.isBoss ? s*1.3 : s;
    const bw = fs*0.7, bh = this.isBoss?6:4;
    const bx = x-bw/2, by = y-fs*1.35;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(bx-1,by-1,bw+2,bh+2);
    ctx.fillStyle = '#333'; ctx.fillRect(bx,by,bw,bh);
    const hp = Math.max(0,this.hp/this.maxHp);
    ctx.fillStyle = hp>0.5?'#e74c3c':hp>0.25?'#e67e22':'#c0392b';
    ctx.fillRect(bx,by,bw*hp,bh);
    // Name
    ctx.fillStyle = this.isBoss ? '#f1c40f' : '#94a3b8';
    ctx.font = this.isBoss ? 'bold 11px monospace' : '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x, by-4);
  }
}
function generateWave(stageIdx, waveNum) {
  const enemies = [];
  const s = CONFIG.stages[stageIdx] || CONFIG.stages[0];
  const count = s.counts[Math.min(waveNum, s.counts.length-1)] || 2;
  const types = s.types;
  const baseScale = s.hpMul;
  const waveBonus = 1 + waveNum * 0.08;
  for (let i=0; i<count; i++) {
    const type = types[Utils.rand(0, types.length-1)];
    enemies.push(new Enemy(type, baseScale * waveBonus));
  }
  return enemies;
}
function generateBoss(stageIdx) {
  const s = CONFIG.stages[stageIdx] || CONFIG.stages[0];
  return new Enemy(null, s.hpMul, true, s.bossIdx);
}
