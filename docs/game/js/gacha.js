// GRAM AFK HEROES - Gacha System

class GachaSystem {
  constructor() {
    this.pityCounter = 0;
    this.mythicPityCounter = 0;
    this.history = [];
  }

  rollHero() {
    const rates = CONFIG.gacha.heroRates;
    let roll = Math.random() * 100;
    
    // Pity system
    if (this.pityCounter >= CONFIG.gacha.pityLegendary) {
      return { rarity: 'LEGENDARY', pity: true };
    }
    if (this.mythicPityCounter >= CONFIG.gacha.pityMythic) {
      return { rarity: 'MYTHIC', pity: true };
    }

    if (roll < rates.MYTHIC) { this.mythicPityCounter = 0; this.pityCounter = 0; return { rarity: 'MYTHIC' }; }
    if (roll < rates.MYTHIC + rates.LEGENDARY) { this.pityCounter = 0; return { rarity: 'LEGENDARY' }; }
    if (roll < rates.MYTHIC + rates.LEGENDARY + rates.EPIC) { return { rarity: 'EPIC' }; }
    if (roll < rates.MYTHIC + rates.LEGENDARY + rates.EPIC + rates.RARE) { return { rarity: 'RARE' }; }
    return { rarity: 'COMMON' };
  }

  rollSkill() {
    const rates = { COMMON: 55, RARE: 30, EPIC: 12, LEGENDARY: 3, MYTHIC: 0 };
    let roll = Math.random() * 100;
    if (roll < rates.MYTHIC) return { rarity: 'MYTHIC' };
    if (roll < rates.MYTHIC + rates.LEGENDARY) return { rarity: 'LEGENDARY' };
    if (roll < rates.MYTHIC + rates.LEGENDARY + rates.EPIC) return { rarity: 'EPIC' };
    if (roll < rates.MYTHIC + rates.LEGENDARY + rates.EPIC + rates.RARE) return { rarity: 'RARE' };
    return { rarity: 'COMMON' };
  }

  pullHero() {
    const result = this.rollHero();
    const classes = Object.keys(CONFIG.heroClasses);
    const classType = classes[Utils.rand(0, classes.length - 1)];
    const hero = new Hero(classType, result.rarity);
    this.history.push({ type: 'hero', rarity: result.rarity, name: hero.name, time: Date.now() });
    return hero;
  }

  pullHero10() {
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(this.pullHero());
    }
    return results;
  }

  drawGachaScreen(ctx, W, H, state) {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🎰 GACHA', W/2, 35);

    // Diamond display
    ctx.fillStyle = '#3498db';
    ctx.font = '14px monospace';
    ctx.fillText(`💎 ${state.diamond}`, W/2, 60);

    // Hero Gacha
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('HERO GACHA', W/2, 100);

    // Rates display
    const rates = CONFIG.gacha.heroRates;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#95a5a6';
    ctx.fillText(`Common ${rates.COMMON}% | Rare ${rates.RARE}% | Epic ${rates.EPIC}%`, W/2, 120);
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(`Legendary ${rates.LEGENDARY}% | Mythic ${rates.MYTHIC}%`, W/2, 135);
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`Pity: Legendary ${CONFIG.gacha.pityLegendary} pulls | Mythic ${CONFIG.gacha.pityMythic} pulls`, W/2, 150);

    // Pull buttons
    const btnW = 140;
    const btnH = 50;
    const btnY = 180;

    // 1x pull
    ctx.fillStyle = state.diamond >= CONFIG.gacha.heroCost ? '#2ecc71' : '#555';
    ctx.fillRect(W/2 - btnW - 10, btnY, btnW, btnH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('1x Pull', W/2 - btnW/2 - 10, btnY + 22);
    ctx.font = '11px monospace';
    ctx.fillText(`💎 ${CONFIG.gacha.heroCost}`, W/2 - btnW/2 - 10, btnY + 40);

    // 10x pull
    ctx.fillStyle = state.diamond >= CONFIG.gacha.heroCost10 ? '#e67e22' : '#555';
    ctx.fillRect(W/2 + 10, btnY, btnW, btnH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('10x Pull', W/2 + btnW/2 + 10, btnY + 22);
    ctx.font = '11px monospace';
    ctx.fillText(`💎 ${CONFIG.gacha.heroCost10}`, W/2 + btnW/2 + 10, btnY + 40);

    // Recent history
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('Recent Pulls:', W/2, btnY + 80);

    const recent = this.history.slice(-5).reverse();
    recent.forEach((h, i) => {
      const ry = btnY + 100 + i * 20;
      ctx.fillStyle = RARITY[h.rarity].color;
      ctx.font = '11px monospace';
      ctx.fillText(`${h.name || h.rarity} (${h.rarity})`, W/2, ry);
    });

    // Back button
    ctx.fillStyle = '#475569';
    ctx.fillRect(20, H - 50, 80, 35);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText('← Back', 60, H - 28);

    return {
      btn1x: { x: W/2 - btnW - 10, y: btnY, w: btnW, h: btnH },
      btn10x: { x: W/2 + 10, y: btnY, w: btnW, h: btnH },
      btnBack: { x: 20, y: H - 50, w: 80, h: 35 }
    };
  }
}
