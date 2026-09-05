class UIManager {
  constructor(game) { this.game=game; this.buttons={}; }
  drawButton(ctx, x, y, w, h, color, label, sublabel=null) {
    const g = ctx.createLinearGradient(x,y,x,y+h);
    g.addColorStop(0, color);
    g.addColorStop(1, Utils.hexToRgba(color, 0.7));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x,y,w,h,8);
    ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x+4, y+2, w-8, h*0.4);
    ctx.fillStyle='#fff';
    ctx.font=`bold ${Math.max(10,h*0.32)}px monospace`;
    ctx.textAlign='center';
    ctx.fillText(label, x+w/2, y+h*0.55);
    if (sublabel) { ctx.font=`${Math.max(8,h*0.22)}px monospace`; ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillText(sublabel, x+w/2, y+h*0.8); }
  }
  drawHome(ctx, W, H) {
    if (this.game && this.game.assets && this.game.assets.bgHome) {
      ctx.drawImage(this.game.assets.bgHome, 0, 0, W, H);
      ctx.fillStyle='rgba(0,0,0,0.5)';
      ctx.fillRect(0,0,W,H);
    } else {
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'#0d1117'); bg.addColorStop(0.5,'#161b22'); bg.addColorStop(1,'#0d1117');
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    }
    // Decorative stars
    ctx.fillStyle='rgba(255,255,255,0.1)';
    for(let i=0;i<20;i++) { const sx=(i*137+50)%W, sy=(i*97+30)%(H*0.4); ctx.fillRect(sx,sy,1,1); }
    // Title
    ctx.fillStyle='#f1c40f'; ctx.font='bold 16px monospace'; ctx.textAlign='center';
    ctx.fillText('⚔ GRAM AFK HEROES', W/2, 35);
    ctx.fillStyle='#6b7280'; ctx.font='9px monospace';
    ctx.fillText(`Stage ${this.game.stage} — Boss ${this.game.bossIndex+1}/15`, W/2, 52);
    // Currency
    const curY = 68;
    ctx.fillStyle=Utils.hexToRgba('#1a1a2e',0.8);
    ctx.beginPath(); ctx.roundRect(10,curY,W-20,30,6); ctx.fill();
    ctx.fillStyle='#f1c40f'; ctx.font='bold 11px monospace'; ctx.textAlign='left';
    ctx.fillText(`🪙 ${Utils.formatNum(this.game.gold)}`, 20, curY+20);
    ctx.fillStyle='#3498db'; ctx.textAlign='right';
    ctx.fillText(`💎 ${this.game.diamond}`, W-20, curY+20);
    // Party
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 10px monospace'; ctx.textAlign='left';
    ctx.fillText('PARTY', 15, 118);
    const slotW = (W-40)/3;
    for(let i=0;i<3;i++) {
      const x=15+i*slotW, y=128, w=slotW-5, h=80;
      ctx.fillStyle=Utils.hexToRgba('#1a1a2e',0.6);
      ctx.beginPath(); ctx.roundRect(x,y,w,h,6); ctx.fill();
      ctx.strokeStyle='#2d3748'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.roundRect(x,y,w,h,6); ctx.stroke();
      if (this.game.party[i]) {
        this.game.party[i].drawPortrait(ctx,x+2,y+2,w-4,h-4,this.game.party.includes(this.game.party[i]));
      } else {
        ctx.fillStyle='#4a5568'; ctx.font='9px monospace'; ctx.textAlign='center';
        ctx.fillText('Empty',x+w/2,y+h/2+3);
      }
    }
    // Buttons
    const bw=W-30, bh=42;
    this.drawButton(ctx,15,225,bw,44,'#16a34a','⚔  BATTLE','Fight Slime & Boss');
    this.drawButton(ctx,15,278,bw/2-5,38,'#2563eb','👥 HEROES');
    this.drawButton(ctx,bw/2+20,278,bw/2-5,38,'#7c3aed','🎰 GACHA');
    this.drawButton(ctx,15,324,bw/2-5,38,'#d97706','📜 QUESTS');
    this.drawButton(ctx,bw/2+20,324,bw/2-5,38,'#059669','🛡 EQUIP');
    this.buttons={battle:{x:15,y:225,w:bw,h:44},heroes:{x:15,y:278,w:bw/2-5,h:38},gacha:{x:bw/2+20,y:278,w:bw/2-5,h:38},quest:{x:15,y:324,w:bw/2-5,h:38},equip:{x:bw/2+20,y:324,w:bw/2-5,h:38}};
    this.drawNav(ctx,W,H,'HOME');
  }
  drawHeroScreen(ctx, W, H) {
    ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#2563eb'; ctx.font='bold 16px monospace'; ctx.textAlign='center';
    ctx.fillText('👥 HEROES', W/2, 30);
    ctx.fillStyle='#6b7280'; ctx.font='9px monospace';
    ctx.fillText(`Tap to add/remove from party (${this.game.party.length}/3)`, W/2, 48);
    const heroes = this.game.heroes;
    const cols=3, slotW=(W-30)/cols, slotH=88;
    heroes.forEach((hero,i)=>{
      const col=i%cols, row=Math.floor(i/cols);
      const x=15+col*slotW, y=58+row*(slotH+5);
      if (y>-slotH && y<H) {
        const inParty = this.game.party.indexOf(hero)>=0;
        ctx.fillStyle=Utils.hexToRgba('#1a1a2e',0.6);
        ctx.beginPath(); ctx.roundRect(x,y,slotW-5,slotH,6); ctx.fill();
        ctx.strokeStyle=inParty?RARITY[hero.rarity].color:'#2d3748';
        ctx.lineWidth=inParty?2:1;
        ctx.beginPath(); ctx.roundRect(x,y,slotW-5,slotH,6); ctx.stroke();
        ctx.lineWidth=1;
        hero.drawPortrait(ctx,x+2,y+2,slotW-9,slotH-14,inParty);
        ctx.fillStyle=inParty?'#2ecc71':'#4a5568'; ctx.font='7px monospace'; ctx.textAlign='center';
        ctx.fillText(inParty?'✓ IN PARTY':'TAP TO ADD',x+slotW/2-2,y+slotH-2);
      }
    });
    this.drawNav(ctx,W,H,'HEROES');
  }
  drawBattleHUD(ctx, W, H) {
    // Auto button (bigger, clearer)
    const bx=W-95, by=H-120, bw=85, bh=55;
    ctx.fillStyle='rgba(0,0,0,0.75)';
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.fill();
    ctx.strokeStyle=this.game.autoBattle?'#2ecc71':'#e74c3c';
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,10); ctx.stroke();
    ctx.lineWidth=1;
    ctx.fillStyle=this.game.autoBattle?'#2ecc71':'#e74c3c';
    ctx.font='bold 11px monospace'; ctx.textAlign='center';
    ctx.fillText(this.game.autoBattle?'⚔ AUTO':'✋ TAP', bx+bw/2, by+22);
    ctx.fillStyle='#f1c40f'; ctx.font='bold 10px monospace';
    ctx.fillText(`${this.game.battleSpeed}x`, bx+bw/2, by+42);
    this.buttons={autoToggle:{x:bx,y:by,w:bw,h:bh}};
  }
  drawQuests(ctx, W, H) {
    ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#d97706'; ctx.font='bold 16px monospace'; ctx.textAlign='center';
    ctx.fillText('📜 DAILY QUESTS', W/2, 30);
    if (this.game.dailyQuests.length===0) {
      this.game.dailyQuests=[
        {id:'q1',desc:'Win 3 battles',type:'battle',target:3,progress:0,completed:false,goldReward:500,diamondReward:0},
        {id:'q2',desc:'Win 1 boss fight',type:'boss',target:1,progress:0,completed:false,goldReward:1000,diamondReward:10},
        {id:'q3',desc:'Do 1 gacha pull',type:'gacha',target:1,progress:0,completed:false,goldReward:300,diamondReward:5}
      ];
    }
    this.game.dailyQuests.forEach((q,i)=>{
      const y=50+i*70;
      ctx.fillStyle=q.completed?Utils.hexToRgba('#16a34a',0.15):Utils.hexToRgba('#1a1a2e',0.6);
      ctx.beginPath(); ctx.roundRect(15,y,W-30,60,8); ctx.fill();
      ctx.strokeStyle=q.completed?'#16a348':'#2d3748';
      ctx.beginPath(); ctx.roundRect(15,y,W-30,60,8); ctx.stroke();
      ctx.fillStyle=q.completed?'#2ecc71':'#e2e8f0'; ctx.font='10px monospace'; ctx.textAlign='left';
      ctx.fillText(q.desc, 25, y+18);
      const barW=W-70, pct=Math.min(1,q.progress/q.target);
      ctx.fillStyle='#1e293b'; ctx.fillRect(25,y+26,barW,6);
      ctx.fillStyle=q.completed?'#2ecc71':'#f59e0b';
      ctx.beginPath(); ctx.roundRect(25,y+26,barW*pct,6,3); ctx.fill();
      ctx.fillStyle='#6b7280'; ctx.font='8px monospace';
      ctx.fillText(`${q.progress}/${q.target}`,30+barW,y+32);
      ctx.fillStyle='#f1c40f'; ctx.font='9px monospace'; ctx.textAlign='right';
      ctx.fillText(`+${q.goldReward}G ${q.diamondReward>0?'+'+q.diamondReward+'💎':''}`,W-25,y+50);
    });
    const done=this.game.dailyQuests.filter(q=>q.completed).length;
    ctx.fillStyle='#6b7280'; ctx.font='10px monospace'; ctx.textAlign='left';
    ctx.fillText(`Completed: ${done}/${this.game.dailyQuests.length}`,15,H-60);
    this.drawButton(ctx,15,H-48,100,36,'#475569','← Back');
    this.buttons={back:{x:15,y:H-48,w:100,h:36}};
    this.drawNav(ctx,W,H,'HOME');
  }
  drawGacha(ctx, W, H) {
    ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,W,H);
    // BG particles
    ctx.fillStyle='rgba(124,58,237,0.05)';
    for(let i=0;i<15;i++) { const px=(i*137+20)%W, py=(i*97+10)%H; ctx.beginPath(); ctx.arc(px,py,2+Math.random()*3,0,Math.PI*2); ctx.fill(); }
    ctx.fillStyle='#a855f7'; ctx.font='bold 18px monospace'; ctx.textAlign='center';
    ctx.fillText('🎰 GACHA', W/2, 30);
    ctx.fillStyle='#3498db'; ctx.font='12px monospace';
    ctx.fillText(`💎 ${this.game.diamond}`, W/2, 50);
    ctx.fillStyle='#a78bfa'; ctx.font='bold 13px monospace';
    ctx.fillText('HERO GACHA', W/2, 80);
    const r=CONFIG.gacha.heroRates;
    ctx.fillStyle='#6b7280'; ctx.font='8px monospace';
    ctx.fillText(`Common ${r.COMMON}% | Rare ${r.RARE}% | Epic ${r.EPIC}%`, W/2, 100);
    ctx.fillStyle='#f1c40f';
    ctx.fillText(`Legendary ${r.LEGENDARY}% | Mythic ${r.MYTHIC}%`, W/2, 115);
    ctx.fillStyle='#c084fc';
    ctx.fillText(`Pity: L${CONFIG.gacha.pityLegendary} / M${CONFIG.gacha.pityMythic}`, W/2, 130);
    const bw=150, bh=50, btnY=150;
    this.drawButton(ctx,W/2-bw-8,btnY,bw,bh,this.game.diamond>=100?'#7c3aed':'#374151','1x Pull','💎 100');
    this.drawButton(ctx,W/2+8,btnY,bw,bh,this.game.diamond>=900?'#c026d3':'#374151','10x Pull','💎 900');
    ctx.fillStyle='#94a3b8'; ctx.font='10px monospace';
    ctx.fillText('Recent Pulls:', W/2, btnY+bh+25);
    const recent=this.game.gacha.history.slice(-5).reverse();
    recent.forEach((h,i)=>{
      ctx.fillStyle=RARITY[h.rarity].color; ctx.font='9px monospace';
      ctx.fillText(`${h.name} (${h.rarity})`, W/2, btnY+bh+45+i*16);
    });
    this.drawButton(ctx,15,H-48,100,36,'#475569','← Back');
    this.buttons={btn1x:{x:W/2-bw-8,y:btnY,w:bw,h:bh},btn10x:{x:W/2+8,y:btnY,w:bw,h:bh},back:{x:15,y:H-48,w:100,h:36}};
    this.drawNav(ctx,W,H,'GACHA');
  }
  drawGachaResult(ctx, W, H, hero) {
    ctx.fillStyle='rgba(0,0,0,0.9)'; ctx.fillRect(0,0,W,H);
    const rc=RARITY[hero.rarity].color;
    const g=ctx.createRadialGradient(W/2,H/2-40,10,W/2,H/2-40,160);
    g.addColorStop(0,Utils.hexToRgba(rc,0.4)); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle=rc; ctx.font='bold 14px monospace'; ctx.textAlign='center';
    ctx.fillText(`★ ${hero.rarity} ★`, W/2, H/2-130);
    const cw=130,ch=140,cx=W/2-cw/2,cy=H/2-90;
    ctx.fillStyle=Utils.hexToRgba(hero.colors.body,0.3);
    ctx.beginPath(); ctx.roundRect(cx,cy,cw,ch,10); ctx.fill();
    ctx.strokeStyle=rc; ctx.lineWidth=3;
    ctx.beginPath(); ctx.roundRect(cx,cy,cw,ch,10); ctx.stroke();
    ctx.lineWidth=1;
    const ms=30;
    ctx.fillStyle=hero.colors.body; ctx.fillRect(cx+cw/2-ms*0.3,cy+20,ms*0.6,ms*0.5);
    ctx.fillStyle=hero.colors.skin; ctx.fillRect(cx+cw/2-ms*0.2,cy+8,ms*0.4,ms*0.25);
    ctx.fillStyle=hero.colors.hair; ctx.fillRect(cx+cw/2-ms*0.22,cy+5,ms*0.44,ms*0.1);
    ctx.fillStyle='#2d3436';
    ctx.fillRect(cx+cw/2-ms*0.08,cy+28,ms*0.06,ms*0.06);
    ctx.fillRect(cx+cw/2+ms*0.04,cy+28,ms*0.06,ms*0.06);
    ctx.fillStyle='#e2e8f0'; ctx.font='bold 13px monospace';
    ctx.fillText(hero.name, W/2, cy+ch*0.7);
    ctx.fillStyle=rc; ctx.font='10px monospace';
    ctx.fillText(`${hero.role} — Lv${hero.level}`, W/2, cy+ch*0.83);
    ctx.fillStyle='#f1c40f'; ctx.font='11px monospace';
    ctx.fillText('★'.repeat(hero.star), W/2, cy+ch*0.95);
    ctx.fillStyle='#6b7280'; ctx.font='10px monospace';
    ctx.fillText('Tap to continue', W/2, H/2+100);
  }
  drawNav(ctx, W, H, active) {
    const navH=50, navY=H-navH;
    ctx.fillStyle='#111';
    ctx.fillRect(0,navY,W,navH);
    ctx.strokeStyle='#1e293b'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,navY); ctx.lineTo(W,navY); ctx.stroke();
    const items=[{i:'🏠',n:'HOME'},{i:'⚔',n:'BATTLE'},{i:'👥',n:'HEROES'},{i:'🎰',n:'GACHA'}];
    const iw=W/items.length;
    items.forEach((item,idx)=>{
      const x=idx*iw;
      ctx.fillStyle=item.n===active?'#a78bfa':'#4a5568';
      ctx.font='16px monospace'; ctx.textAlign='center';
      ctx.fillText(item.i, x+iw/2, navY+30);
      if (item.n===active) { ctx.fillStyle='#a78bfa'; ctx.fillRect(x+iw/2-12,navY,24,2); }
    });
  }
  handleTap(x,y,W,H) {
    for(const [n,b] of Object.entries(this.buttons)) {
      if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h) return n;
    }
    if(y>H-50) { const iw=W/4; return ['HOME','BATTLE','HEROES','GACHA'][Math.floor(x/iw)]||null; }
    return null;
  }
}
