// GRAM AFK HEROES - Game Configuration
// All balance numbers here for easy adjustment

const CONFIG = {
  // Player
  player: {
    maxParty: 3,
    startGold: 500,
    startDiamond: 100
  },

  // Hero classes
  heroClasses: {
    SWORDMAN: {
      name: 'Swordman',
      role: 'DPS',
      position: 'FRONT',
      color: '#e74c3c',
      baseStats: { hp: 800, atk: 150, def: 50, spd: 120, critRate: 5, critDmg: 1.5, skillPower: 100, healPower: 80 },
      skills: [
        { name: 'Slash', type: 'damage', power: 1.5, cooldown: 2, desc: 'Physical damage 150% ATK' },
        { name: 'Rending Slash', type: 'damage', power: 2.0, cooldown: 3, desc: '200% ATK + 30% DEF down' },
        { name: 'Blade Storm', type: 'ultimate', power: 5.0, energy: 100, desc: '500% ATK to all enemies' }
      ]
    },
    TANK: {
      name: 'Tank',
      role: 'Defender',
      position: 'FRONT',
      color: '#3498db',
      baseStats: { hp: 1200, atk: 60, def: 150, spd: 80, critRate: 3, critDmg: 1.5, skillPower: 80, healPower: 60 },
      skills: [
        { name: 'Shield Bash', type: 'damage', power: 1.5, cooldown: 3, desc: '150% ATK + 20% stun' },
        { name: 'Guard Up', type: 'shield', power: 0.5, cooldown: 4, desc: "Increase party DEF 30% for 3 turns" },
        { name: 'Wall of Defense', type: 'ultimate', power: 0.5, energy: 100, desc: 'Self shield 50% max HP' }
      ]
    },
    MAGE: {
      name: 'Mage',
      role: 'Burst DPS',
      position: 'BACK',
      color: '#9b59b6',
      baseStats: { hp: 600, atk: 100, def: 40, spd: 100, critRate: 8, critDmg: 1.8, skillPower: 200, healPower: 50 },
      skills: [
        { name: 'Fireball', type: 'damage', power: 1.8, cooldown: 2, desc: 'AoE damage 180% ATK' },
        { name: 'Arcane Burst', type: 'damage', power: 2.5, cooldown: 3, desc: '250% ATK + 50% burn' },
        { name: 'Meteor Swarm', type: 'ultimate', power: 4.0, energy: 100, desc: '400% ATK AoE damage' }
      ]
    },
    HEALER: {
      name: 'Healer',
      role: 'Support',
      position: 'BACK',
      color: '#2ecc71',
      baseStats: { hp: 700, atk: 50, def: 45, spd: 90, critRate: 5, critDmg: 1.5, skillPower: 120, healPower: 200 },
      skills: [
        { name: 'Healing Light', type: 'heal', power: 2.5, cooldown: 2, desc: 'Heal 250% Heal Power' },
        { name: 'Purification', type: 'heal', power: 1.5, cooldown: 3, desc: 'Remove debuff + heal 150%' },
        { name: 'Divine Salvation', type: 'ultimate', power: 4.0, energy: 100, desc: 'Heal all heroes 400% Heal Power' }
      ]
    }
  },

  // Koroco types
  koroco: {
    NORMAL: { name: 'Koroco', color: '#7f8c8d', hp: 100, atk: 15, def: 5 },
    TANK: { name: 'Tank Koroco', color: '#27ae60', hp: 180, atk: 8, def: 15 },
    ATTACK: { name: 'Attack Koroco', color: '#e67e22', hp: 60, atk: 25, def: 3 },
    RANGED: { name: 'Ranged Koroco', color: '#8e44ad', hp: 80, atk: 18, def: 4, ranged: true },
    SUPPORT: { name: 'Support Koroco', color: '#f1c40f', hp: 90, atk: 10, def: 6, support: true }
  },

  // Bosses
  bosses: [
    { name: 'Stone Golem', mech: 'highDef', color: '#7f8c8d', hp: 800, atk: 30, def: 30 },
    { name: 'Infernal Mage', mech: 'aoe', color: '#e74c3c', hp: 1000, atk: 40, def: 10 },
    { name: 'Blood Demon', mech: 'lifesteal', color: '#c0392b', hp: 1200, atk: 35, def: 15 },
    { name: 'Rage Beast', mech: 'rage', color: '#d35400', hp: 900, atk: 38, def: 12 },
    { name: 'Crystal Colossus', mech: 'shield', color: '#16a085', hp: 1500, atk: 25, def: 25 },
    { name: 'Phantom Queen', mech: 'speed', color: '#6c5ce7', hp: 1100, atk: 42, def: 8 },
    { name: 'Venom Spitter', mech: 'poison', color: '#27ae60', hp: 1000, atk: 32, def: 18 },
    { name: 'Koroco King', mech: 'summon', color: '#f39c12', hp: 1300, atk: 30, def: 20 },
    { name: 'Shadow Archer', mech: 'crit', color: '#2d3436', hp: 1200, atk: 45, def: 10 },
    { name: 'Iron Guardian', mech: 'tank', color: '#95a5a6', hp: 1800, atk: 28, def: 30 },
    { name: 'Dark Priest', mech: 'healer', color: '#8e44ad', hp: 1000, atk: 38, def: 14 },
    { name: 'Storm Titan', mech: 'aoe', color: '#34495e', hp: 1600, atk: 40, def: 20 },
    { name: 'Berserker King', mech: 'berserk', color: '#e74c3c', hp: 1400, atk: 50, def: 12 },
    { name: 'Elemental Lord', mech: 'shield', color: '#ff6b6b', hp: 1700, atk: 45, def: 18 },
    { name: 'Grand Koroco', mech: 'final', color: '#c843cf', hp: 2500, atk: 55, def: 25 }
  ],

  // Gacha rates
  gacha: {
    heroCost: 100,
    heroCost10: 900,
    skillCost: 80,
    skillCost10: 700,
    heroRates: { COMMON: 50, RARE: 30, EPIC: 15, LEGENDARY: 4.5, MYTHIC: 0.5 },
    pityLegendary: 10,
    pityMythic: 40
  },

  // Economy
  economy: {
    korocoGold: [10, 50],
    bossGold: [200, 500],
    korocoXp: [100, 300],
    bossXp: [500, 1500],
    afkMaxHours: 12,
    afkRate: 0.5
  },

  // Battle
  battle: {
    waveCount: 3,
    minKorocoPerWave: [2, 3, 4],
    xpMultiplier: 1.15,
    speedOptions: [1, 2, 3]
  }
};

// Rarity config
const RARITY = {
  COMMON: { name: 'Common', color: '#95a5a6', multiplier: 1.0 },
  RARE: { name: 'Rare', color: '#3498db', multiplier: 1.2 },
  EPIC: { name: 'Epic', color: '#9b59b6', multiplier: 1.5 },
  LEGENDARY: { name: 'Legendary', color: '#f1c40f', multiplier: 2.0 },
  MYTHIC: { name: 'Mythic', color: '#e74c3c', multiplier: 2.5 }
};
