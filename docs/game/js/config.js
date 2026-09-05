const CONFIG = {
  player: { maxParty: 3, startGold: 500, startDiamond: 100 },
  heroClasses: {
    SWORDMAN: {
      name: 'Arthur', role: 'DPS', position: 'FRONT',
      colors: { body: '#e74c3c', accent: '#c0392b', weapon: '#bdc3c7', hair: '#f39c12', skin: '#fad6a5' },
      baseStats: { hp: 800, atk: 150, def: 50, spd: 120, critRate: 5, critDmg: 1.5, skillPower: 100, healPower: 80 },
      skills: [
        { name: 'Slash', type: 'damage', power: 1.5, cooldown: 2, desc: '150% ATK' },
        { name: 'Rending Slash', type: 'damage', power: 2.0, cooldown: 3, desc: '200% ATK' },
        { name: 'Blade Storm', type: 'ultimate', power: 5.0, energy: 100, desc: '500% ATK ALL' }
      ]
    },
    TANK: {
      name: 'Tank', role: 'Defender', position: 'FRONT',
      colors: { body: '#2980b9', accent: '#1a5276', weapon: '#7f8c8d', hair: '#2c3e50', skin: '#fad6a5' },
      baseStats: { hp: 1200, atk: 60, def: 150, spd: 80, critRate: 3, critDmg: 1.5, skillPower: 80, healPower: 60 },
      skills: [
        { name: 'Shield Bash', type: 'damage', power: 1.5, cooldown: 3, desc: '150% ATK' },
        { name: 'Guard Up', type: 'shield', power: 0.5, cooldown: 4, desc: 'DEF +30%' },
        { name: 'Wall of Defense', type: 'ultimate', power: 0.5, energy: 100, desc: 'Shield 50% HP' }
      ]
    },
    MAGE: {
      name: 'Mage', role: 'Burst DPS', position: 'BACK',
      colors: { body: '#8e44ad', accent: '#6c3483', weapon: '#f39c12', hair: '#e74c3c', skin: '#fad6a5' },
      baseStats: { hp: 600, atk: 100, def: 40, spd: 100, critRate: 8, critDmg: 1.8, skillPower: 200, healPower: 50 },
      skills: [
        { name: 'Fireball', type: 'damage', power: 1.8, cooldown: 2, desc: '180% ATK' },
        { name: 'Arcane Burst', type: 'damage', power: 2.5, cooldown: 3, desc: '250% ATK' },
        { name: 'Meteor Swarm', type: 'ultimate', power: 4.0, energy: 100, desc: '400% ATK ALL' }
      ]
    },
    HEALER: {
      name: 'Healer', role: 'Support', position: 'BACK',
      colors: { body: '#27ae60', accent: '#1e8449', weapon: '#f1c40f', hair: '#ecf0f1', skin: '#fad6a5' },
      baseStats: { hp: 700, atk: 50, def: 45, spd: 90, critRate: 5, critDmg: 1.5, skillPower: 120, healPower: 200 },
      skills: [
        { name: 'Heal', type: 'heal', power: 2.5, cooldown: 2, desc: 'Heal 250%' },
        { name: 'Purify', type: 'heal', power: 1.5, cooldown: 3, desc: 'Cleanse+Heal' },
        { name: 'Salvation', type: 'ultimate', power: 4.0, energy: 100, desc: 'Heal ALL 400%' }
      ]
    }
  },
  slime: {
    NORMAL: { name: 'Slime', colors: { body: '#7f8c8d', accent: '#95a5a6', eye: '#e74c3c' }, hp: 100, atk: 15, def: 5 },
    TANK: { name: 'Iron Slime', colors: { body: '#27ae60', accent: '#2ecc71', eye: '#f39c12' }, hp: 180, atk: 8, def: 15 },
    ATTACK: { name: 'Fury Slime', colors: { body: '#e67e22', accent: '#d35400', eye: '#e74c3c' }, hp: 60, atk: 25, def: 3 },
    RANGED: { name: 'Arcane Slime', colors: { body: '#8e44ad', accent: '#9b59b6', eye: '#f1c40f' }, hp: 80, atk: 18, def: 4 },
    SUPPORT: { name: 'Shaman Slime', colors: { body: '#f1c40f', accent: '#f39c12', eye: '#2ecc71' }, hp: 90, atk: 10, def: 6 }
  },
  bosses: [
    { name: 'Stone Golem', mech: 'highDef', colors: { body: '#7f8c8d', accent: '#95a5a6', eye: '#e74c3c' }, hp: 800, atk: 30, def: 30 },
    { name: 'Infernal Mage', mech: 'aoe', colors: { body: '#e74c3c', accent: '#c0392b', eye: '#f39c12' }, hp: 1000, atk: 40, def: 10 },
    { name: 'Blood Demon', mech: 'lifesteal', colors: { body: '#c0392b', accent: '#922b21', eye: '#e74c3c' }, hp: 1200, atk: 35, def: 15 },
    { name: 'Rage Beast', mech: 'rage', colors: { body: '#d35400', accent: '#e67e22', eye: '#f1c40f' }, hp: 900, atk: 38, def: 12 },
    { name: 'Crystal Lord', mech: 'shield', colors: { body: '#16a085', accent: '#1abc9c', eye: '#ecf0f1' }, hp: 1500, atk: 25, def: 25 },
    { name: 'Phantom Queen', mech: 'speed', colors: { body: '#6c5ce7', accent: '#a29bfe', eye: '#fd79a8' }, hp: 1100, atk: 42, def: 8 },
    { name: 'Venom Lord', mech: 'poison', colors: { body: '#27ae60', accent: '#2ecc71', eye: '#e74c3c' }, hp: 1000, atk: 32, def: 18 },
    { name: 'Giant Slime King', mech: 'summon', colors: { body: '#f39c12', accent: '#f1c40f', eye: '#e74c3c' }, hp: 1300, atk: 30, def: 20 },
    { name: 'Shadow Stalker', mech: 'crit', colors: { body: '#2d3436', accent: '#636e72', eye: '#e74c3c' }, hp: 1200, atk: 45, def: 10 },
    { name: 'Iron Guardian', mech: 'tank', colors: { body: '#95a5a6', accent: '#bdc3c7', eye: '#3498db' }, hp: 1800, atk: 28, def: 30 },
    { name: 'Dark Priest', mech: 'healer', colors: { body: '#8e44ad', accent: '#6c3483', eye: '#e74c3c' }, hp: 1000, atk: 38, def: 14 },
    { name: 'Storm Titan', mech: 'aoe', colors: { body: '#34495e', accent: '#2c3e50', eye: '#3498db' }, hp: 1600, atk: 40, def: 20 },
    { name: 'Berserker King', mech: 'berserk', colors: { body: '#e74c3c', accent: '#c0392b', eye: '#f1c40f' }, hp: 1400, atk: 50, def: 12 },
    { name: 'Void Emperor', mech: 'shield', colors: { body: '#2d3436', accent: '#6c5ce7', eye: '#e74c3c' }, hp: 1700, atk: 45, def: 18 },
    { name: 'Grand Slime', mech: 'final', colors: { body: '#c843cf', accent: '#a855f7', eye: '#fbbf24' }, hp: 2500, atk: 55, def: 25 }
  ],
  gacha: { heroCost: 100, heroCost10: 900, heroRates: { COMMON: 50, RARE: 30, EPIC: 15, LEGENDARY: 4.5, MYTHIC: 0.5 }, pityLegendary: 10, pityMythic: 40 },
  economy: { slimeGold: [10, 50], bossGold: [200, 500], slimeXp: [100, 300], bossXp: [500, 1500] },
  battle: { waveCount: 3, minSlimePerWave: [2, 3, 4] }
};
const RARITY = {
  COMMON: { name: 'Common', color: '#95a5a6', glow: '#7f8c8d', multiplier: 1.0 },
  RARE: { name: 'Rare', color: '#3498db', glow: '#2980b9', multiplier: 1.2 },
  EPIC: { name: 'Epic', color: '#9b59b6', glow: '#8e44ad', multiplier: 1.5 },
  LEGENDARY: { name: 'Legendary', color: '#f1c40f', glow: '#f39c12', multiplier: 2.0 },
  MYTHIC: { name: 'Mythic', color: '#e74c3c', glow: '#c0392b', multiplier: 2.5 }
};
