// GRAM AFK HEROES - Main Game Engine

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.W = 400;
    this.H = 700;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.screen = 'HOME';
    this.autoBattle = true;
    this.battleSpeed = 1;
    this.stage = 1;
    this.bossIndex = 0;
    this.gold = 500;
    this.diamond = 100;
    this.heroes = [];
    this.party = [];
    this.inventory = [];
    this.quests = [];
    this.dailyQuests = [];
    this.achievements = [];
    this.battle = null;
    this.gacha = new GachaSystem();
    this.ui = new UIManager(this);
    this.gachaResult = null;
    this.notification = null;
    this.notificationTimer = 0;
    // Assets loaded globally via assets.js
    this.init();
  }


  init() {
    // Starter hero
    const starter = new Hero('SWORDMAN', 'COMMON', 1, 1);
    this.heroes.push(starter);
    this.party.push(starter);
    this.showNotification('Welcome! You got a Swordman!');
    this.setupEvents();
    this.setupInput();
    this.gameLoop();
  }

  setupEvents() {
    events.on('battle_end', (data) => {
      if (data.result === 'VICTORY') {
        this.gold += data.rewards.gold;
        this.addXpToParty(data.rewards.xp);
        if (this.battle && this.battle.bossDefeated) {
          this.bossIndex++;
          if (this.bossIndex >= CONFIG.bosses.length) {
            this.bossIndex = 0;
            this.stage++;
            this.showNotification(`Stage ${this.stage} unlocked!`);
          }
        }
        this.dailyQuests.forEach(q => {
          if (q.type === 'battle' && !q.completed) {
            q.progress++;
            if (q.progress >= q.target) q.completed = true;
          }
        });
      }
    });
  }

  addXpToParty(amount) {
    this.party.forEach(hero => {
      if (hero.isAlive) {
        hero.addXp(amount);
      }
    });
  }

  setupInput() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.W / rect.width;
      const scaleY = this.H / rect.height;
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    };
    const handleTap = (e) => {
      e.preventDefault();
      const pos = getPos(e);
      this.handleTap(pos.x, pos.y);
    };
    this.canvas.addEventListener('click', handleTap);
    this.canvas.addEventListener('touchstart', handleTap);
  }

  handleTap(x, y) {
    if (this.gachaResult) { this.gachaResult = null; return; }
    if (this.notification) { this.notification = null; return; }

    if (this.screen === 'BATTLE' && this.battle) {
      if (this.battle.isVictory || this.battle.isDefeat) {
        this.screen = 'HOME';
        this.battle = null;
        return;
      }
      const btn = this.ui.handleTap(x, y, this.W, this.H);
      if (btn === 'autoToggle') {
        this.autoBattle = !this.autoBattle;
        this.battle.autoBattle = this.autoBattle;
      } else if (btn === 'speedToggle') {
        this.battleSpeed = this.battleSpeed >= 3 ? 1 : this.battleSpeed + 1;
        this.battle.battleSpeed = this.battleSpeed;
      }
      return;
    }

    if (this.screen === 'GACHA') {
      const btn = this.ui.handleTap(x, y, this.W, this.H);
      if (btn === 'btn1x' && this.diamond >= CONFIG.gacha.heroCost) {
        this.diamond -= CONFIG.gacha.heroCost;
        const hero = this.gacha.pullHero();
        this.heroes.push(hero);
        this.gachaResult = hero;
      } else if (btn === 'btn10x' && this.diamond >= CONFIG.gacha.heroCost10) {
        this.diamond -= CONFIG.gacha.heroCost10;
        const heroes = this.gacha.pullHero10();
        heroes.forEach(h => this.heroes.push(h));
        this.gachaResult = heroes[heroes.length - 1];
      } else if (btn === 'btnBack') {
        this.screen = 'HOME';
      }
      return;
    }

    // Bottom nav
    const navY = this.H - 50;
    if (y > navY) {
      const itemW = this.W / 4;
      const idx = Math.floor(x / itemW);
      const screens = ['HOME', 'BATTLE', 'HEROES', 'GACHA'];
      if (screens[idx]) {
        if (screens[idx] === 'BATTLE') this.startBattle();
        else this.screen = screens[idx];
      }
      return;
    }

    if (this.screen === 'HOME') {
      const btn = this.ui.handleTap(x, y, this.W, this.H);
      if (btn === 'battle') this.startBattle();
      else if (btn === 'heroes') this.screen = 'HEROES';
      else if (btn === 'gacha') this.screen = 'GACHA';
      else if (btn === 'quests') this.screen = 'QUESTS';
    }

    if (this.screen === 'HEROES') {
      const cols = 3;
      const slotW = (this.W - 30) / cols;
      const slotH = 85;
      const col = Math.floor((x - 15) / slotW);
      const row = Math.floor((y - 45) / (slotH + 5));
      const idx = row * cols + col;
      if (idx >= 0 && idx < this.heroes.length) {
        this.toggleParty(this.heroes[idx]);
      }
      const navBtn = this.ui.handleTap(x, y, this.W, this.H);
      if (navBtn === 'HOME') this.screen = 'HOME';
    }
  }

  toggleParty(hero) {
    const idx = this.party.indexOf(hero);
    if (idx >= 0) {
      this.party.splice(idx, 1);
    } else if (this.party.length < 3) {
      this.party.push(hero);
    }
  }

  startBattle() {
    if (this.party.length === 0) {
      this.showNotification('Add heroes to your party first!');
      return;
    }
    this.party.forEach(h => { h.hp = h.maxHp; h.isAlive = true; h.energy = 0; h.shield = 0; h.defBuff = 0; h.cooldowns = [0, 0, 0]; });
    this.battle = new BattleSystem(this.party, this.stage, this.bossIndex);
    this.battle.autoBattle = this.autoBattle;
    this.battle.battleSpeed = this.battleSpeed;
    this.screen = 'BATTLE';
  }

  showNotification(text) {
    this.notification = text;
    this.notificationTimer = 120;
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    if (this.screen === 'BATTLE' && this.battle && this.battle.autoBattle) {
      if (!this.battle.isVictory && !this.battle.isDefeat) {
        this.battle.update();
        this.battle.updateNumbers();
      }
    }
    if (this.notification) {
      this.notificationTimer--;
      if (this.notificationTimer <= 0) this.notification = null;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    switch (this.screen) {
      case 'BATTLE':
        if (this.battle) {
          this.battle.drawBattle(ctx, this.W, this.H);
          this.ui.drawBattleHUD(ctx, this.W, this.H);
        }
        break;
      case 'HOME':
        this.ui.drawHome(ctx, this.W, this.H);
        break;
      case 'HEROES':
        this.ui.drawHeroScreen(ctx, this.W, this.H);
        break;
      case 'GACHA':
        this.gacha.drawGachaScreen(ctx, this.W, this.H, { diamond: this.diamond });
        break;
      case 'QUESTS':
        this.ui.drawQuests(ctx, this.W, this.H);
        break;
    }

    if (this.gachaResult) {
      this.ui.drawGachaResult(ctx, this.W, this.H, this.gachaResult);
    }

    if (this.notification) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(20, this.H / 2 - 30, this.W - 40, 60);
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, this.H / 2 - 30, this.W - 40, 60);
      ctx.lineWidth = 1;
      ctx.fillStyle = '#fff';
      ctx.font = '13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.notification, this.W / 2, this.H / 2 + 5);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
