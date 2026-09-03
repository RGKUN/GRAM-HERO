class Hero {
  constructor(classType, rarity='COMMON', level=1, star=1) {
    this.id = Utils.generateUUID();
    this.classType = classType;
    const base = CONFIG.heroClasses[classType];
    this.name = base.name;
    this.role = base.role;
    this.position = base.position;
    this.colors = base.colors;
    this.rarity = rarity;
    this.level = level;
    this.star = star;
    this.xp = 0;
    this.skills = JSON.parse(JSON.stringify(base.skills));
    this.energy = 0;
    this.hp = 0; this.maxHp = 0; this.shield = 0; this.defBuff = 0;
    this.cooldowns = [0, 0, 0];
    this.isAlive = true;
    this.animFrame = 0;
    this.animTimer = 0;
    this.hitFlash = 0;
    this.healFlash = 0;
    this.equipment = {};
    this.calcStats();
    this.hp = this.maxHp;
  }
  calcStats() {
    const b = CONFIG.heroClasses[this.classType].baseStats;
    const rm = RARITY[this.rarity].multiplier;
    const lm = 1 + (this.level-1) * 0.025;
    const sm = 1 + (this.star-1) * 0.15;
    this.maxHp = Math.floor(b.hp * rm * lm * sm * sm);
    this.atk = Math.floor(b.atk * rm * lm * sm);
    this.def = Math.floor(b.def * rm * lm * sm);
    this.spd = Math.floor(b.spd * rm * (1 + (this.level-1)*0.008));
    this.critRate = b.critRate + (this.star-1)*2;
    this.critDmg = b.critDmg + (this.star-1)*0.1;
    this.skillPower = Math.floor(b.skillPower * rm * lm * sm);
    this.healPower = Math.floor(b.healPower * rm * lm * sm);
  }
  getLevelUpXp() { return Math.floor(100 + this.level * 50 + Math.pow(this.level, 1.8)); }
  addXp(amount) {
    this.xp += amount;
    const results = [];
    while (this.xp >= this.getLevelUpXp() && this.level < 100) {
      this.xp -= this.getLevelUpXp();
      this.level++;
      this.calcStats();
      this.hp = Math.min(this.hp + Math.floor(this.maxHp*0.1), this.maxHp);
      results.push({ type:'LEVEL_UP', hero:this.name, level:this.level });
    }
    return results;
  }
  takeDamage(dmg) {
    const mitigated = Math.max(1, Math.floor(dmg * 100 / (100 + this.def + this.defBuff)));
    this.hitFlash = 8;
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, mitigated);
      this.shield -= absorbed;
      return Math.max(0, mitigated - absorbed);
    }
    this.hp -= mitigated;
    if (this.hp <= 0) { this.hp = 0; this.isAlive = false; }
    return mitigated;
  }
  heal(amount) {
    if (!this.isAlive) return 0;
    const healed = Math.min(amount, this.maxHp - this.hp);
    this.hp += healed;
    this.healFlash = 10;
    return healed;
  }
  addEnergy(a) { this.energy = Math.min(100, this.energy + a); }
  useEnergy() { if (this.energy >= 100) { this.energy = 0; return true; } return false; }
  tickCooldowns() { for (let i=0;i<3;i++) if (this.cooldowns[i]>0) this.cooldowns[i]--; }
  canUseSkill(i) { return this.skills[i] && this.cooldowns[i]===0 && this.isAlive; }
  useSkill(i) { if (!this.canUseSkill(i)) return null; const s=this.skills[i]; this.cooldowns[i]=s.cooldown; return s; }

  draw(ctx, x, y, size) {
    if (!this.isAlive) return;
    const s = size;
    this.animTimer++;
    if (this.animTimer % 20 === 0) this.animFrame = (this.animFrame + 1) % 2;
    const bobY = this.animFrame === 0 ? 0 : -2;
    const c = this.colors;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y+4, s*0.4, s*0.1, 0, 0, Math.PI*2);
    ctx.fill();

    // Body
    ctx.fillStyle = c.body;
    ctx.fillRect(x-s*0.3, y-s*0.9+bobY, s*0.6, s*0.5);
    // Accent
    ctx.fillStyle = c.accent;
    ctx.fillRect(x-s*0.3, y-s*0.45+bobY, s*0.6, s*0.15);
    // Head
    ctx.fillStyle = c.skin;
    ctx.fillRect(x-s*0.2, y-s*1.15+bobY, s*0.4, s*0.3);
    // Hair
    ctx.fillStyle = c.hair;
    ctx.fillRect(x-s*0.22, y-s*1.18+bobY, s*0.44, s*0.12);
    // Eyes
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(x-s*0.1, y-s*0.95+bobY, s*0.08, s*0.08);
    ctx.fillRect(x+s*0.05, y-s*0.95+bobY, s*0.08, s*0.08);
    // Weapon
    ctx.fillStyle = c.weapon;
    if (this.classType === 'SWORDMAN') {
      ctx.fillRect(x+s*0.3, y-s*0.8+bobY, s*0.06, s*0.5);
      ctx.fillRect(x+s*0.25, y-s*0.85+bobY, s*0.16, s*0.06);
    } else if (this.classType === 'TANK') {
      ctx.fillRect(x+s*0.25, y-s*0.7+bobY, s*0.25, s*0.35);
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(x+s*0.27, y-s*0.68+bobY, s*0.21, s*0.31);
    } else if (this.classType === 'MAGE') {
      ctx.fillRect(x+s*0.25, y-s*0.9+bobY, s*0.06, s*0.55);
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(x+s*0.28, y-s*0.95+bobY, s*0.08, 0, Math.PI*2);
      ctx.fill();
    } else {
      ctx.fillRect(x+s*0.25, y-s*0.8+bobY, s*0.2, s*0.08);
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(x+s*0.35, y-s*0.84+bobY, s*0.06, 0, Math.PI*2);
      ctx.fill();
    }
    // Hit flash
    if (this.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.hitFlash/8*0.5})`;
      ctx.fillRect(x-s*0.3, y-s*1.15+bobY, s*0.6, s*1.2);
      this.hitFlash--;
    }
    // Heal flash
    if (this.healFlash > 0) {
      ctx.fillStyle = `rgba(46,204,113,${this.healFlash/10*0.3})`;
      ctx.fillRect(x-s*0.3, y-s*1.15+bobY, s*0.6, s*1.2);
      this.healFlash--;
    }
    // HP bar
    const bw = s*0.7, bh = 5;
    const bx = x - bw/2, by = y - s*1.25;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(bx-1, by-1, bw+2, bh+2);
    ctx.fillStyle = '#333';
    ctx.fillRect(bx, by, bw, bh);
    const hp = this.hp/this.maxHp;
    ctx.fillStyle = hp>0.5 ? '#2ecc71' : hp>0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(bx, by, bw*hp, bh);
    // Energy bar
    const ey = by+bh+1;
    ctx.fillStyle = '#222';
    ctx.fillRect(bx, ey, bw, 2);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(bx, ey, bw*(this.energy/100), 2);
    // Star
    ctx.fillStyle = '#f1c40f';
    ctx.font = `${Math.max(6,s*0.15)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('★'.repeat(this.star), x, y+14);
  }

  drawPortrait(ctx, x, y, w, h, selected=false) {
    const bg = ctx.createLinearGradient(x, y, x, y+h);
    bg.addColorStop(0, Utils.hexToRgba(this.colors.body, 0.4));
    bg.addColorStop(1, Utils.hexToRgba(this.colors.body, 0.1));
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);
    // Border
    ctx.strokeStyle = selected ? RARITY[this.rarity].color : Utils.hexToRgba(RARITY[this.rarity].color, 0.5);
    ctx.lineWidth = selected ? 2 : 1;
    ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1;
    // Mini character
    const cx = x+w/2, cy = y+h*0.4;
    const ms = w*0.25;
    ctx.fillStyle = this.colors.body;
    ctx.fillRect(cx-ms*0.3, cy-ms*0.5, ms*0.6, ms*0.4);
    ctx.fillStyle = this.colors.skin;
    ctx.fillRect(cx-ms*0.2, cy-ms*0.7, ms*0.4, ms*0.25);
    ctx.fillStyle = this.colors.hair;
    ctx.fillRect(cx-ms*0.22, cy-ms*0.73, ms*0.44, ms*0.1);
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(cx-ms*0.08, cy-ms*0.55, ms*0.06, ms*0.06);
    ctx.fillRect(cx+ms*0.04, cy-ms*0.55, ms*0.06, ms*0.06);
    // Name
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `bold ${Math.max(7,w*0.12)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x+w/2, y+h*0.72);
    ctx.fillStyle = RARITY[this.rarity].color;
    ctx.font = `${Math.max(6,w*0.1)}px monospace`;
    ctx.fillText(`Lv${this.level}`, x+w/2, y+h*0.85);
    ctx.fillText('★'.repeat(this.star), x+w/2, y+h*0.95);
  }
}
