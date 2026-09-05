class Game {
  constructor() {
    this.canvas=document.getElementById('game-canvas');
    this.ctx=this.canvas.getContext('2d');
    this.W=400; this.H=720;
    this.canvas.width=this.W; this.canvas.height=this.H;
    this.screen='HOME';
    this.autoBattle=true; this.battleSpeed=1;
    this.stage=1; this.bossIndex=0;
    this.gold=500; this.diamond=100;
    this.heroes=[]; this.party=[]; this.dailyQuests=[]; this.achievements=[];
    this.battle=null;
    this.gacha=new GachaSystem();
    this.ui=new UIManager(this);
    this.gachaResult=null;
    this.notification=null; this.notificationTimer=0;
    this.assets={bgHome:null,bgStage:null}; this.loadAssets();
    this.init();
  }
  loadAssets() {
    const imgs={bgHome:'assets/bg_home.png',bgStage:'assets/bg_stage.png',portraitSwordman:'assets/portrait_swordman.jpg'};
    ['idle','walk','attack','hit','death'].forEach(anim => {
      const count = anim==='attack'?6:anim==='hit'?2:4;
      for(let i=1;i<=count;i++) imgs['swordman_'+anim+'_'+i]='assets/swordman/'+anim+'_'+String(i).padStart(2,'0')+'.png';
    });
    for(const[k,v] of Object.entries(imgs)){
      const img=new Image();
      img.onload=((key,img)=>()=>{this.assets[key]=img;console.log('[ASSETS] Loaded:'+key);})(k,img);
      img.onerror=(()=>{console.error('[ASSETS] Failed:'+v);})();
      img.src=v;
    }
    // SFX
    this.sfx={};
    // Slime sprites
    ['idle','walk','hit','death'].forEach(anim => {
      const count = anim==='hit'?2:4;
      for(let i=1;i<=count;i++) imgs['slime_'+anim+'_'+i]='assets/slime/'+anim+'_'+String(i).padStart(2,'0')+'.png';
    });
    ['sword_1','sword_2','sword_3'].forEach(k=>{
      this.sfx[k]=new Audio('assets/sfx/'+k+'.wav');
      this.sfx[k].volume=0.8;
    });
  }
  init() {
    const starter=new Hero('SWORDMAN','COMMON',1,1);
    this.heroes.push(starter); this.party.push(starter);
    this.showNotification('Welcome Hero! Tap BATTLE to start!');
    this.setupEvents(); this.setupInput(); this.gameLoop();
  }
  setupEvents() {
    events.on('battle_end',(data)=>{
      if(data.result==='VICTORY'){
        this.gold+=data.rewards.gold;
        this.party.forEach(h=>{ if(h.isAlive) h.addXp(data.rewards.xp); });
        if(this.battle&&this.battle.bossDefeated){
          this.bossIndex++;
          if(this.bossIndex>=CONFIG.bosses.length){this.bossIndex=0;this.stage++;this.showNotification(`Stage ${this.stage} unlocked!`);}
        }
        this.dailyQuests.forEach(q=>{ if(q.type==='battle'&&!q.completed){q.progress++;if(q.progress>=q.target)q.completed=true;} });
        this.showNotification(`+${data.rewards.gold} Gold!`);
      }
    });
  }
  setupInput(){
    const getPos=(e)=>{const r=this.canvas.getBoundingClientRect();const sx=this.W/r.width,sy=this.H/r.height;const t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*sx,y:(t.clientY-r.top)*sy};};
    const tap=(e)=>{e.preventDefault();const p=getPos(e);this.handleTap(p.x,p.y);};
    this.canvas.addEventListener('click',tap);
    this.canvas.addEventListener('touchstart',tap);
  }
  handleTap(x,y){
    if(this.gachaResult){this.gachaResult=null;return;}
    if(this.notification){this.notification=null;return;}
    if(this.screen==='BATTLE'&&this.battle){
      if(this.battle.isVictory||this.battle.isDefeat){this.screen='HOME';this.battle=null;return;}
      const btn=this.ui.handleTap(x,y,this.W,this.H);
      if(btn==='autoToggle'){this.autoBattle=!this.autoBattle;this.battle.autoBattle=this.autoBattle;}
      return;
    }
    if(this.screen==='GACHA'){
      const btn=this.ui.handleTap(x,y,this.W,this.H);
      if(btn==='btn1x'&&this.diamond>=100){this.diamond-=100;const h=this.gacha.pullHero();this.heroes.push(h);this.gachaResult=h;this.dailyQuests.forEach(q=>{if(q.type==='gacha'&&!q.completed)q.progress++;});}
      else if(btn==='btn10x'&&this.diamond>=900){this.diamond-=900;const hs=this.gacha.pullHero10();hs.forEach(h=>this.heroes.push(h));this.gachaResult=hs[hs.length-1];}
      else if(btn==='back')this.screen='HOME';
      else if(['HOME','HEROES'].includes(btn))this.screen=btn;
      return;
    }
    if(this.screen==='HEROES'){
      const btn=this.ui.handleTap(x,y,this.W,this.H);
      if(btn==='HOME'||btn==='GACHA'){this.screen=btn;return;}
      if(btn==='BATTLE'){this.startBattle();return;}
      // Toggle hero in party
      const cols=3,slotW=(this.W-30)/cols,slotH=88;
      const col=Math.floor((x-15)/slotW),row=Math.floor((y-58)/(slotH+5));
      const idx=row*cols+col;
      if(idx>=0&&idx<this.heroes.length)this.toggleParty(this.heroes[idx]);
      return;
    }
    if(this.screen==='HOME'){
      const btn=this.ui.handleTap(x,y,this.W,this.H);
      if(btn==='battle')this.startBattle();
      else if(btn==='heroes')this.screen='HEROES';
      else if(btn==='gacha')this.screen='GACHA';
      else if(btn==='quest')this.screen='QUESTS';
      else if(btn==='BATTLE')this.startBattle();
      else if(['HEROES','GACHA'].includes(btn))this.screen=btn;
    }
  }
  toggleParty(hero){
    const idx=this.party.indexOf(hero);
    if(idx>=0)this.party.splice(idx,1);
    else if(this.party.length<3)this.party.push(hero);
  }
  startBattle(){
    if(this.party.length===0){this.showNotification('Add heroes to party first!');return;}
    this.party.forEach(h=>{h.hp=h.maxHp;h.isAlive=true;h.energy=0;h.shield=0;h.defBuff=0;h.cooldowns=[0,0,0];});
    this.battle=new BattleSystem(this.party,this.stage,this.bossIndex);
    this.battle.autoBattle=this.autoBattle;this.battle.battleSpeed=this.battleSpeed;
    this.screen='BATTLE';
  }
  showNotification(t){this.notification=t;this.notificationTimer=150;}
  gameLoop(){this.update();this.draw();requestAnimationFrame(()=>this.gameLoop());}
  update(){
    if(this.screen==='BATTLE'&&this.battle&&this.battle.autoBattle){
      if(!this.battle.isVictory&&!this.battle.isDefeat){this.battle.update();this.battle.updateFx();}
    }
    if(this.notification){this.notificationTimer--;if(this.notificationTimer<=0)this.notification=null;}
  }
  draw(){
    const ctx=this.ctx;ctx.clearRect(0,0,this.W,this.H);
    switch(this.screen){
      case 'BATTLE':if(this.battle){this.battle.drawBattle(ctx,this.W,this.H);this.ui.drawBattleHUD(ctx,this.W,this.H);}break;
      case 'HOME':this.ui.drawHome(ctx,this.W,this.H);break;
      case 'HEROES':this.ui.drawHeroScreen(ctx,this.W,this.H);break;
      case 'GACHA':this.ui.drawGacha(ctx,this.W,this.H);break;
      case 'QUESTS':this.ui.drawQuests(ctx,this.W,this.H);break;
    }
    if(this.gachaResult)this.ui.drawGachaResult(ctx,this.W,this.H,this.gachaResult);
    if(this.notification){
      ctx.fillStyle='rgba(13,17,23,0.95)';
      ctx.beginPath();ctx.roundRect(20,this.H/2-25,this.W-40,50,10);ctx.fill();
      ctx.strokeStyle='#a78bfa';ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect(20,this.H/2-25,this.W-40,50,10);ctx.stroke();
      ctx.lineWidth=1;
      ctx.fillStyle='#fff';ctx.font='11px monospace';ctx.textAlign='center';
      ctx.fillText(this.notification,this.W/2,this.H/2+5);
    }
  }
}
window.addEventListener('DOMContentLoaded',()=>{window.game=new Game();});
// Polyfill for roundRect
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    r=Math.min(r,w/2,h/2);
    this.moveTo(x+r,y);
    this.arcTo(x+w,y,x+w,y+h,r);
    this.arcTo(x+w,y+h,x,y+h,r);
    this.arcTo(x,y+h,x,y,r);
    this.arcTo(x,y,x+w,y,r);
    this.closePath();
    return this;
  };
}
function formatNum(n){if(n>=1000000)return(n/1000000).toFixed(1)+'M';if(n>=1000)return(n/1000).toFixed(1)+'K';return Math.floor(n).toString();}
Utils.formatNum=formatNum;
