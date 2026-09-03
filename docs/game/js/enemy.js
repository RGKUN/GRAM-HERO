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
      const k = CONFIG.koroco[type];
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
    this.hitFlash = 0;
    this._counted = false;
    this.id = Utils.generateUUID();
  }
  takeDamage(dmg) {
    const mitigated = Math.max(1, Math.floor(dmg*100/(100+this.def)));
    this.hitFlash = 8;
    if (this.shield > 0) { const a=Math.min(this.shield,mitigated); this.shield-=a; return Math.max(0,mitigated-a); }
    this.hp -= mitigated;
    if (this.hp <= 0) { this.hp = 0; this.isAlive = false; }
    if (this.mech==='rage' && this.hp/this.maxHp<0.3 && !this.rageAct) { this.atk = Math.floor(this.atk*1.5); this.rageAct=true; }
    return mitigated;
  }
  applyMechanic(enemies) {
    const fx = [];
    if (!this.isBoss || !this.isAlive) return fx;
    switch(this.mech) {
      case 'shield': this.shield = Math.floor(this.maxHp*0.2); fx.push({type:'shield',t:30}); break;
      case 'summon':
        if (enemies.filter(e=>e.isKoroco&&e.isAlive).length<4) { enemies.push(new Enemy('NORMAL',0.8)); fx.push({type:'summon',t:30}); }
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
    const s = this.isBoss ? size*1.5 : size;
    this.animTimer++;
    if (this.animTimer%24===0) this.animFrame=(this.animFrame+1)%2;
    const bob = this.animFrame===0 ? 0 : -2;
    const c = this.colors;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(x, y+4, s*0.5, s*0.12, 0,0,Math.PI*2); ctx.fill();
    // Body
    ctx.fillStyle = c.body;
    ctx.fillRect(x-s*0.35, y-s*0.85+bob, s*0.7, s*0.55);
    // Belly
    ctx.fillStyle = c.accent;
    ctx.fillRect(x-s*0.25, y-s*0.5+bob, s*0.5, s*0.2);
    // Head
    ctx.fillStyle = c.body;
    ctx.fillRect(x-s*0.25, y-s*1.15+bob, s*0.5, s*0.35);
    // Eyes
    ctx.fillStyle = c.eye;
    ctx.fillRect(x-s*0.15, y-s*0.95+bob, s*0.1, s*0.12);
    ctx.fillRect(x+s*0.05, y-s*0.95+bob, s*0.1, s*0.12);
    // Boss crown
    if (this.isBoss) {
      ctx.fillStyle = c.eye;
      for (let i=0;i<3;i++) {
        ctx.fillRect(x-s*0.2+i*s*0.14, y-s*1.28+bob, s*0.07, s*0.1);
      }
      // Boss glow
      ctx.strokeStyle = Utils.hexToRgba(c.eye, 0.5);
      ctx.lineWidth = 2;
      ctx.strokeRect(x-s*0.35-4, y-s*1.25+bob, s*0.7+8, s*0.9+8);
      ctx.lineWidth = 1;
    }
    // Hit flash
    if (this.hitFlash>0) {
      ctx.fillStyle = `rgba(255,255,255,${this.hitFlash/8*0.5})`;
      ctx.fillRect(x-s*0.35, y-s*1.15+bob, s*0.7, s*0.9);
      this.hitFlash--;
    }
    // Shield
    if (this.shield>0) {
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.strokeRect(x-s*0.35-3, y-s*1.2+bob, s*0.7+6, s*0.95+6);
      ctx.lineWidth = 1;
    }
    // HP bar
    const bw = s*0.7, bh = this.isBoss?6:4;
    const bx = x-bw/2, by = y-s*1.35;
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
function generateWave(stage, waveNum) {
  const enemies = [];
  const types = Object.keys(CONFIG.koroco);
  const count = CONFIG.battle.minKorocoPerWave[Math.min(waveNum, CONFIG.battle.minKorocoPerWave.length-1)];
  const scale = 1 + (stage-1)*0.15 + waveNum*0.1;
  for (let i=0;i<count;i++) enemies.push(new Enemy(types[Utils.rand(0,types.length-1)], scale));
  return enemies;
}
function generateBoss(stage, bossIndex) {
  return new Enemy(null, 1+(stage-1)*0.2, true, bossIndex);
}
