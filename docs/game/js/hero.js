// GRAM AFK HEROES - Hero System

class Hero {
  constructor(classType, rarity = 'COMMON', level = 1, star = 1) {
    this.id = Utils.generateUUID();
    this.classType = classType;
    const base = CONFIG.heroClasses[classType];
    this.name = base.name;
    this.role = base.role;
    this.position = base.position;
    this.color = base.color;
    this.rarity = rarity;
    this.level = level;
    this.star = star;
    this.xp = 0;
    this.skills = Utils.deepClone(base.skills);
    this.energy = 0;
    this.hp = 0;
    this.maxHp = 0;
    this.shield = 0;
    this.defBuff = 0;
    this.cooldowns = [0, 0, 0];
    this.isAlive = true;
    this.equipment = { WEAPON: null, ARMOR: null, HELMET: null, ACCESSORY: null };
    this.calcStats();
    this.hp = this.maxHp;
  }

  calcStats() {
    const base = CONFIG.heroClasses[this.classType].baseStats;
    const rarityMul = RARITY[this.rarity].multiplier;
    const levelMul = 1 + (this.level - 1) * this.getGrowthRate();
    const starMul = 1 + (this.star - 1) * 0.15;
    const eqBonus = this.getEquipmentBonus();

    this.maxHp = Math.floor(base.hp * rarityMul * levelMul * starMul * starMul + eqBonus.hp);
    this.atk = Math.floor(base.atk * rarityMul * levelMul * starMul + eqBonus.atk);
    this.def = Math.floor(base.def * rarityMul * levelMul * starMul + eqBonus.def);
    this.spd = Math.floor(base.spd * rarityMul * (1 + (this.level - 1) * 0.008) + eqBonus.spd);
    this.critRate = base.critRate + (this.star - 1) * 2 + eqBonus.critRate;
    this.critDmg = base.critDmg + (this.star - 1) * 0.1;
    this.skillPower = Math.floor(base.skillPower * rarityMul * levelMul * starMul);
    this.healPower = Math.floor(base.healPower * rarityMul * levelMul * starMul);
  }

  getGrowthRate() {
    const rates = { SWORDMAN: 0.025, TANK: 0.03, MAGE: 0.022, HEALER: 0.024 };
    return rates[this.classType] || 0.025;
  }

  getEquipmentBonus() {
    const bonus = { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0 };
    for (const slot of Object.values(this.equipment)) {
      if (slot) {
        const rarityMul = RARITY[slot.rarity].multiplier;
        bonus.hp += Math.floor(slot.baseHp * rarityMul * (1 + (slot.level - 1) * 0.05));
        bonus.atk += Math.floor(slot.baseAtk * rarityMul * (1 + (slot.level - 1) * 0.05));
        bonus.def += Math.floor(slot.baseDef * rarityMul * (1 + (slot.level - 1) * 0.05));
        bonus.spd += Math.floor((slot.baseSpd || 0) * rarityMul);
        bonus.critRate += (slot.bonusCrit || 0);
      }
    }
    return bonus;
  }

  getLevelUpXp() {
    return Math.floor(100 + this.level * 50 + Math.pow(this.level, 1.8));
  }

  addXp(amount) {
    this.xp += amount;
    const results = [];
    while (this.xp >= this.getLevelUpXp() && this.level < 100) {
      this.xp -= this.getLevelUpXp();
      this.level++;
      this.calcStats();
      this.hp = Math.min(this.hp + Math.floor(this.maxHp * 0.1), this.maxHp);
      results.push({ type: 'LEVEL_UP', hero: this.name, level: this.level });
    }
    return results;
  }

  takeDamage(dmg) {
    const mitigated = Math.max(1, Math.floor(dmg * 100 / (100 + this.def + this.defBuff)));
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
    return mitigated;
  }

  heal(amount) {
    if (!this.isAlive) return 0;
    const healed = Math.min(amount, this.maxHp - this.hp);
    this.hp += healed;
    return healed;
  }

  addEnergy(amount) {
    this.energy = Math.min(100, this.energy + amount);
  }

  useEnergy() {
    if (this.energy >= 100) {
      this.energy = 0;
      return true;
    }
    return false;
  }

  tickCooldowns() {
    for (let i = 0; i < this.cooldowns.length; i++) {
      if (this.cooldowns[i] > 0) this.cooldowns[i]--;
    }
  }

  canUseSkill(index) {
    return this.skills[index] && this.cooldowns[index] === 0 && this.isAlive;
  }

  useSkill(index) {
    if (!this.canUseSkill(index)) return null;
    const skill = this.skills[index];
    this.cooldowns[index] = skill.cooldown;
    return skill;
  }

  draw(ctx, x, y, size) {
    if (!this.isAlive) return;
    const s = size;

    // Body
    ctx.fillStyle = this.color;
    ctx.fillRect(x - s/2, y - s, s, s);

    // Front/Back indicator
    if (this.position === 'FRONT') {
      ctx.fillStyle = Utils.hexToRgba(this.color, 0.3);
      ctx.fillRect(x - s/2 - 4, y - s + 4, s + 8, s - 8);
    }

    // Class icon (pixel art)
    ctx.fillStyle = '#fff';
    ctx.font = `${s * 0.3}px monospace`;
    ctx.textAlign = 'center';
    const icons = { SWORDMAN: '⚔', TANK: '🛡', MAGE: '🔮', HEALER: '💚' };
    ctx.fillText(icons[this.classType] || '?', x, y - s * 0.4);

    // HP bar
    const barW = s;
    const barH = 6;
    const barX = x - barW/2;
    const barY = y - s - 10;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    const hpPct = this.hp / this.maxHp;
    ctx.fillStyle = hpPct > 0.5 ? '#2ecc71' : hpPct > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(barX, barY, barW * hpPct, barH);

    // Energy bar
    const eBarY = barY + barH + 2;
    ctx.fillStyle = '#222';
    ctx.fillRect(barX, eBarY, barW, 3);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(barX, eBarY, barW * (this.energy / 100), 3);

    // Name + Level
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.name} Lv${this.level}`, x, y + 12);

    // Shield indicator
    if (this.shield > 0) {
      ctx.fillStyle = '#3498db';
      ctx.font = '10px monospace';
      ctx.fillText(`🛡${this.shield}`, x, y + 24);
    }
  }

  drawPortrait(ctx, x, y, w, h) {
    // Background
    ctx.fillStyle = Utils.hexToRgba(this.color, 0.3);
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = RARITY[this.rarity].color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Icon
    ctx.fillStyle = this.color;
    ctx.font = `${w * 0.4}px monospace`;
    ctx.textAlign = 'center';
    const icons = { SWORDMAN: '⚔', TANK: '🛡', MAGE: '🔮', HEALER: '💚' };
    ctx.fillText(icons[this.classType], x + w/2, y + h * 0.45);

    // Name
    ctx.fillStyle = '#fff';
    ctx.font = '9px monospace';
    ctx.fillText(this.name, x + w/2, y + h * 0.7);
    ctx.fillText(`Lv${this.level}`, x + w/2, y + h * 0.85);

    // Star
    ctx.fillStyle = '#f1c40f';
    ctx.font = '8px monospace';
    ctx.fillText('★'.repeat(this.star), x + w/2, y + h - 4);
  }
}
