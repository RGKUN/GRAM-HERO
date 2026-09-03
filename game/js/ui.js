// GRAM AFK HEROES - UI System

class UIManager {
  constructor(game) {
    this.game = game;
    this.screen = 'HOME';
    this.buttons = {};
  }

  setScreen(screen) {
    this.screen = screen;
  }

  drawHome(ctx, W, H) {
    if (window.game && window.game.assets && window.game.assets.bgHome && window.game.assets.bgHome.complete) {
      ctx.drawImage(window.game.assets.bgHome, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);
    }

    // Header
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, W, 60);
    ctx.lineWidth = 1;

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚔ GRAM AFK HEROES', W / 2, 25);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Stage ${this.game.stage} | Boss ${this.game.bossIndex + 1}/15`, W / 2, 50);

    // Currency
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`🪙 ${Utils.formatNum(this.game.gold)}`, 10, 90);
    ctx.fillStyle = '#3498db';
    ctx.fillText(`💎 ${this.game.diamond}`, W / 2 + 30, 90);

    // Party
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('YOUR PARTY', 10, 115);

    const party = this.game.party;
    const slotW = (W - 40) / 3;
    for (let i = 0; i < 3; i++) {
      const x = 10 + i * slotW;
      const y = 125;
      ctx.fillStyle = '#16162a';
      ctx.fillRect(x, y, slotW - 5, 80);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x, y, slotW - 5, 80);

      if (party[i]) {
        party[i].drawPortrait(ctx, x + 2, y + 2, slotW - 9, 76);
        ctx.strokeStyle = RARITY[party[i].rarity].color;
        ctx.strokeRect(x, y, slotW - 5, 80);
      } else {
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Empty', x + slotW / 2 - 2, y + 40);
      }
    }

    // Buttons
    const bw = W - 30;
    const bh = 40;

    const btnBattle = { x: 15, y: 225, w: bw, h: 44, label: '⚔ BATTLE', color: '#17a34a' };
    const btnHeroes = { x: 15, y: 279, w: bw / 2 - 5, h: 40, label: '👥 HEROES', color: '#2563eb' };
    const btnGacha = { x: bw / 2 + 20, y: 279, w: bw / 2 - 5, h: 40, label: '🎰 GACHA', color: '#7c3aed' };
    const btnQuest = { x: 15, y: 329, w: bw / 2 - 5, h: 40, label: '📜 QUESTS', color: '#d97706' };
    const btnEquip = { x: bw / 2 + 20, y: 329, w: bw / 2 - 5, h: 40, label: '🛡 EQUIP', color: '#059669' };

    [btnBattle, btnHeroes, btnGacha, btnQuest, btnEquip].forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, b.x + b.w / 2, b.y + 26);
    });

    // Daily quest mini
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Daily Quest:', 15, 390);
    const activeQuests = this.game.dailyQuests || [];
    if (activeQuests.length > 0) {
      const q = activeQuests[0];
      ctx.fillStyle = q.completed ? '#2ecc71' : '#f39c12';
      ctx.fillText(`${q.desc} (${q.progress}/${q.target})`, 15, 410);
    }

    this.drawBottomNav(ctx, W, H, 'HOME');

    this.buttons = {
      battle: { x: 15, y: 225, w: bw, h: 44 },
      heroes: { x: 15, y: 279, w: bw / 2 - 5, h: 40 },
      gacha: { x: bw / 2 + 20, y: 279, w: bw / 2 - 5, h: 40 },
      quest: { x: 15, y: 329, w: bw / 2 - 5, h: 40 },
      equip: { x: bw / 2 + 20, y: 329, w: bw / 2 - 5, h: 40 }
    };
  }

  drawHeroScreen(ctx, W, H) {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('👥 HEROES', W / 2, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`Tap hero to add/remove from party (${this.game.party.length}/3)`, W / 2, 48);

    const heroes = this.game.heroes;
    const cols = 3;
    const slotW = (W - 30) / cols;
    const slotH = 90;

    heroes.forEach((hero, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 15 + col * slotW;
      const y = 60 + row * (slotH + 5);

      if (y > -slotH && y < H) {
        const isInParty = this.game.party.indexOf(hero) >= 0;
        ctx.fillStyle = '#16162a';
        ctx.fillRect(x, y, slotW - 5, slotH);
        ctx.strokeStyle = isInParty ? RARITY[hero.rarity].color : '#333';
        ctx.lineWidth = isInParty ? 2 : 1;
        ctx.strokeRect(x, y, slotW - 5, slotH);
        ctx.lineWidth = 1;

        hero.drawPortrait(ctx, x + 2, y + 2, slotW - 9, slotH - 14);

        ctx.fillStyle = isInParty ? '#2ecc71' : '#475569';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isInParty ? 'IN PARTY' : 'TAP TO ADD', x + slotW / 2 - 2, y + slotH - 2);
      }
    });

    this.drawBottomNav(ctx, W, H, 'HEROES');
  }

  drawBattleHUD(ctx, W, H) {
    // Auto toggle
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(W - 95, H - 130, 90, 55);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(W - 95, H - 130, 90, 55);

    ctx.fillStyle = this.game.autoBattle ? '#2ecc71' : '#e74c3c';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.game.autoBattle ? 'AUTO ON' : 'AUTO OFF', W - 50, H - 108);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`Speed ${this.game.battleSpeed}x`, W - 50, H - 90);

    // Turn info
    if (this.game.battle) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`Turn ${this.game.battle.turn} | Kills ${this.game.battle.totalKills}`, 10, H - 10);
    }

    this.buttons = {
      autoToggle: { x: W - 95, y: H - 130, w: 90, h: 55 }
    };
  }

  drawQuests(ctx, W, H) {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('📜 DAILY QUESTS', W / 2, 35);

    // Generate if empty
    if (this.game.dailyQuests.length === 0) {
      this.game.dailyQuests = [
        { id: 'q1', desc: 'Win 3 battles', type: 'battle', target: 3, progress: 0, completed: false, goldReward: 500, diamondReward: 0 },
        { id: 'q2', desc: 'Win 1 boss', type: 'boss', target: 1, progress: 0, completed: false, goldReward: 1000, diamondReward: 10 },
        { id: 'q3', desc: 'Do 1 gacha pull', type: 'gacha', target: 1, progress: 0, completed: false, goldReward: 300, diamondReward: 5 }
      ];
    }

    this.game.dailyQuests.forEach((q, i) => {
      const y = 60 + i * 75;
      ctx.fillStyle = q.completed ? '#0d2818' : '#16162a';
      ctx.fillRect(15, y, W - 30, 65);
      ctx.strokeStyle = q.completed ? '#2ecc71' : '#333';
      ctx.strokeRect(15, y, W - 30, 65);

      ctx.fillStyle = q.completed ? '#2ecc71' : '#fff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(q.desc, 25, y + 20);

      // Progress bar
      const barW = W - 70;
      const pct = Math.min(1, q.progress / q.target);
      ctx.fillStyle = '#333';
      ctx.fillRect(25, y + 30, barW, 8);
      ctx.fillStyle = q.completed ? '#2ecc71' : '#f39c12';
      ctx.fillRect(25, y + 30, barW * pct, 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`${q.progress} / ${q.target}`, 30 + barW, y + 38);

      ctx.fillStyle = '#f1c40f';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`+${q.goldReward}G ${q.diamondReward > 0 ? '+'+q.diamondReward+'💎' : ''}`, W - 25, y + 55);
    });

    // Total progress
    const totalDone = this.game.dailyQuests.filter(q => q.completed).length;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Completed: ${totalDone}/${this.game.dailyQuests.length}`, 15, H - 70);

    // Back
    ctx.fillStyle = '#475569';
    ctx.fillRect(15, H - 100, 90, 35);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('← Back', 60, H - 78);

    this.buttons = {
      back: { x: 15, y: H - 100, w: 90, h: 35 }
    };
    this.drawBottomNav(ctx, W, H, 'HOME');
  }

  drawGachaResult(ctx, W, H, hero) {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, W, H);

    const rarityColor = RARITY[hero.rarity].color;

    // Glow
    const grad = ctx.createRadialGradient(W / 2, H / 2 - 60, 10, W / 2, H / 2 - 60, 140);
    grad.addColorStop(0, Utils.hexToRgba(rarityColor, 0.6));
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Rarity text
    ctx.fillStyle = rarityColor;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${hero.rarity} ★`, W / 2, H / 2 - 130);

    // Card
    const cw = 120, ch = 130;
    const cx = W / 2 - cw / 2, cy = H / 2 - 80;
    ctx.fillStyle = Utils.hexToRgba(hero.color, 0.3);
    ctx.fillRect(cx, cy, cw, ch);
    ctx.strokeStyle = rarityColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(cx, cy, cw, ch);
    ctx.lineWidth = 1;

    const icons = { SWORDMAN: '⚔', TANK: '🛡', MAGE: '🔮', HEALER: '💚' };
    ctx.fillStyle = hero.color;
    ctx.font = '40px monospace';
    ctx.fillText(icons[hero.classType], W / 2, cy + 55);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(hero.name, W / 2, cy + 85);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText(`${hero.role} | Lv${hero.level}`, W / 2, cy + 105);
    ctx.fillStyle = '#f1c40f';
    ctx.font = '12px monospace';
    ctx.fillText('★'.repeat(hero.star), W / 2, cy + 125);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Tap to continue', W / 2, H / 2 + 100);
  }

  drawBottomNav(ctx, W, H, active) {
    const navH = 50;
    const navY = H - navH;
    const items = [
      { icon: '🏠', name: 'HOME' },
      { icon: '⚔', name: 'BATTLE' },
      { icon: '👥', name: 'HEROES' },
      { icon: '🎰', name: 'GACHA' }
    ];
    const itemW = W / items.length;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, navY, W, navH);

    items.forEach((item, i) => {
      const x = i * itemW;
      ctx.fillStyle = item.name === active ? '#a78bfa' : '#475569';
      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.icon, x + itemW / 2, navY + 32);
      if (item.name === active) {
        ctx.fillStyle = '#a78bfa';
        ctx.fillRect(x + itemW / 2 - 10, navY, 20, 3);
      }
    });
  }

  handleTap(x, y, W, H) {
    for (const [name, btn] of Object.entries(this.buttons)) {
      if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
        return name;
      }
    }
    return null;
  }
}
