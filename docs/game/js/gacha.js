class GachaSystem {
  constructor() { this.pityCounter=0; this.mythicPity=0; this.history=[]; }
  rollHero() {
    const r = CONFIG.gacha.heroRates;
    if (this.pityCounter>=CONFIG.gacha.pityLegendary) { this.pityCounter=0; return {rarity:'LEGENDARY'}; }
    if (this.mythicPity>=CONFIG.gacha.pityMythic) { this.mythicPity=0; this.pityCounter=0; return {rarity:'MYTHIC'}; }
    let roll = Math.random()*100;
    if (roll<r.MYTHIC) { this.mythicPity=0; this.pityCounter=0; return {rarity:'MYTHIC'}; }
    if (roll<r.MYTHIC+r.LEGENDARY) { this.pityCounter=0; return {rarity:'LEGENDARY'}; }
    if (roll<r.MYTHIC+r.LEGENDARY+r.EPIC) return {rarity:'EPIC'};
    if (roll<r.MYTHIC+r.LEGENDARY+r.EPIC+r.RARE) return {rarity:'RARE'};
    return {rarity:'COMMON'};
  }
  pullHero() {
    const result = this.rollHero();
    const classes = Object.keys(CONFIG.heroClasses);
    const hero = new Hero(classes[Utils.rand(0,classes.length-1)], result.rarity);
    this.history.push({rarity:result.rarity, name:hero.name});
    return hero;
  }
  pullHero10() { return Array.from({length:10},()=>this.pullHero()); }
}
