GRAM AFK HEROES — EQUIPMENT & ITEM SYSTEM V1

PERAN: Senior Game Designer + Game Systems Engineer

FOKUS: Equipment System, Equipment Slot, Equipment Stats, Equipment Rarity, Equipment Upgrade, Item System, Inventory, Equipment Drop, Equipment Management, Integrasi Equipment dengan Hero.

TUJUAN: Menambahkan sistem Equipment yang membuat setiap Hero dapat dikembangkan dan memiliki build yang lebih beragam, tanpa membuat sistem terlalu rumit untuk versi awal.

BATASAN: Jangan membangun Equipment Trading, Marketplace, NFT, Player-to-Player Trading, PvP Equipment Meta, Blockchain Equipment, GRAM Equipment Economy, Complex Crafting, atau Complex Set System.

---

1. DEVELOPMENT & ASSET RULE

Arsitektur memisahkan:
- Game Logic
- Data
- UI
- Assets

Equipment berbasis data/configuration:

Equipment ID → Equipment Definition → Equipment Stats → Hero → Battle System

Battle System tidak boleh bergantung pada gambar Equipment tertentu. Placeholder asset diperbolehkan. Semua icon/visual Equipment harus dapat diganti tanpa mengubah logic.

---

2. EQUIPMENT SYSTEM OVERVIEW

Equipment = item yang dipasang ke Hero untuk meningkatkan stat.

Equipment Definition (static):
- equipment_id: string
- name: string
- description: string
- type: enum (WEAPON, ARMOR, HELMET, ACCESSORY)
- rarity: enum (COMMON, RARE, EPIC, LEGENDARY, MYTHIC)
- allowed_classes: list of class (ALL atau class spesifik)
- base_stats: { hp, atk, def, spd, crit_rate, crit_dmg, skill_power, heal_power }
- bonus_stats: { stat, value, is_percent } (stat tambahan acak/opsional)
- max_level: int
- upgrade_cost_per_level: Gold + Material
- asset_reference: string

Equipment Instance (per player):
- instance_id: string (UUID)
- equipment_id: FK
- player_id: FK
- current_level: int (1 → max_level)
- bonus_stats: { stat, value, is_percent }
- is_locked: bool
- equipped_to: hero_instance_id atau null

---

3. EQUIPMENT SLOT

Untuk versi awal: 4 slot per Hero.

| Slot | Tipe | Stat Utama |
|------|------|------------|
| Weapon | WEAPON | ATK |
| Armor | ARMOR | DEF, HP |
| Helmet | HELMET | HP, DEF |
| Accessory | ACCESSORY | CRIT, SPD |

TENTATIVE — NEEDS PLAYTEST (jumlah slot bisa ditambah/dikurangi)

Pertimbangan:
- 4 slot cukup untuk variasi build tanpa terlalu rumit
- Pemain tidak perlu manage terlalu banyak item
- Arsitektur mendukung penambahan slot di masa depan

---

4. EQUIPMENT CLASS RESTRICTION

Kebijakan: Equipment dapat digunakan oleh beberapa class.

Contoh:
- Weapon Sword: Swordman, Tank
- Weapon Staff: Mage, Healer
- Armor Heavy: Swordman, Tank
- Armor Light: Mage, Healer
- Helmet: Semua class
- Accessory: Semua class

Mengapa beberapa class?
- Mengurangi jumlah Equipment "sampah" yang tidak bisa dipakai
- Pemain lebih mudah menemukan Equipment yang cocok
- Fleksibilitas build lebih tinggi

Jika Equipment class-specific, drop pool menjadi terlalu besar dan pemain mendapat banyak item yang tidak berguna.

---

5. EQUIPMENT RARITY

Konsisten dengan sistem game:

| Rarity | Base Stat Multiplier | Max Level | Drop Chance |
|--------|---------------------|-----------|-------------|
| Common | 1.0x | 20 | Tinggi |
| Rare | 1.2x | 30 | Sedang |
| Epic | 1.5x | 40 | Rendah |
| Legendary | 2.0x | 50 | Sangat Rendah |
| Mythic | 2.5x | 60 | Ultra Langka |

Semua angka TENTATIVE — NEEDS PLAYTEST.

Rarity Equipment TIDAK identik dengan rarity Hero — ini sistem terpisah.

---

6. EQUIPMENT STATS

Menggunakan stat yang sudah ada di sistem Hero:

- HP
- ATK
- DEF
- SPD
- CRIT Rate
- CRIT DMG
- Skill Power
- Heal Power

TIDAK ada stat baru. Equipment hanya menambah stat yang sudah ada.

---

7. PRIMARY & BONUS STATS

PRIMARY STAT — ditentukan oleh Equipment Type:

| Type | Primary Stat |
|------|-------------|
| Weapon | ATK |
| Armor | DEF + HP |
| Helmet | HP |
| Accessory | SPD + CRIT Rate |

BONUS STAT — 1-2 stat tambahan (random):

Contoh Weapon:
- Primary: +120 ATK
- Bonus: +3% CRIT Rate atau +50 HP

Contoh Accessory:
- Primary: +15 SPD, +5% CRIT Rate
- Bonus: +30 ATK

Untuk versi awal, Bonus Stat tetap (tidak random). Jika ingin random, tandai TENTATIVE.

---

8. EQUIPMENT LEVEL

Level 1 → Max Level (tergantung rarity).

Setiap level meningkatkan stat sebesar Growth Rate:

| Rarity | Max Level | Growth per Level |
|--------|-----------|-----------------|
| Common | 20 | +5% dari base stat |
| Rare | 30 | +5% dari base stat |
| Epic | 40 | +4% dari base stat |
| Legendary | 50 | +4% dari base stat |
| Mythic | 60 | +3% dari base stat |

Contoh: Weapon Common, ATK base 100:
- Level 1: 100 ATK
- Level 10: 100 + (100 × 5% × 9) = 145 ATK
- Level 20: 100 + (100 × 5% × 19) = 195 ATK

Semua angka TENTATIVE — NEEDS PLAYTEST.

---

9. EQUIPMENT UPGRADE

Flow:

Player Select Equipment
    ↓
Upgrade Button (cek resource)
    ↓
Server Validate:
  - Equipment owned by player
  - Current level < max level
  - Gold sufficient
  - Material sufficient (jika ada)
    ↓
Deduct Gold + Material
    ↓
Increase equipment level
    ↓
Recalculate stats
    ↓
Save
    ↓
Return result

Upgrade Cost Formula (TENTATIVE):

cost = base_cost × (1.15 ^ current_level)

Contoh:
- Level 1→2: 200 Gold
- Level 5→6: 360 Gold
- Level 10→11: 800 Gold
- Level 19→20: 2.000 Gold (Common max)

---

10. EQUIPMENT MATERIAL

Untuk versi awal: 1 jenis material.

Material: Equipment Shard

Sumber:
- Stage reward (jarang)
- Boss reward (lebih sering)
- Quest reward (milestone)
- Achievement reward
- Sell/dismantle equipment lain (PROPOSAL — FUTURE)

Drop rate:
- Common: 1-2 Shards
- Rare: 3-5 Shards
- Epic: 5-8 Shards
- Boss: 10-20 Shards

Semua angka TENTATIVE — NEEDS PLAYTEST.

Mengapa 1 material? Agar Inventory tidak penuh dan pemain tidak bingung dengan banyak jenis material.

---

11. EQUIPMENT DROP

Sumber Equipment:

| Sumber | Rarity Range |
|--------|-------------|
| Normal Battle | Common |
| Stage 1-5 | Common / Rare |
| Stage 6-10 | Rare / Epic |
| Boss | Rare / Epic / Legendary |
| Quest | Common / Rare |
| Achievement | Rare / Epic |

Equipment TIDAK dijatuhkan dari setiap Koroco.

Equipment menjadi reward yang lebih bernilai daripada Gold/XP.

---

12. EQUIPMENT DROP TABLE

Configuration-based:

drop_table:
  stage_1:
    - rarity: COMMON, chance: 80%
    - rarity: RARE, chance: 15%
    - rarity: EPIC, chance: 5%
  boss:
    - rarity: RARE, chance: 40%
    - rarity: EPIC, chance: 35%
    - rarity: LEGENDARY, chance: 20%
    - rarity: MYTHIC, chance: 5%

Drop rate harus diubah melalui configuration, bukan hardcode di Battle Logic.

---

13. BOSS EQUIPMENT

Boss memiliki peluang Equipment drop yang lebih tinggi.

Normal Battle → 10-20% chance Equipment drop
Boss → 100% chance Equipment drop (minimal Common)

Boss Equipment Drop:
- Boss 1-5: Rare minimum
- Boss 6-10: Epic minimum
- Boss 11-15: Legendary minimum

Boss bukan satu-satunya sumber Equipment. Player tetap berkembang dari stage farming.

---

14. EQUIPMENT INVENTORY

Inventory menampilkan:

| Kolom | Deskripsi |
|-------|-----------|
| Icon | Equipment icon (asset reference) |
| Name | Nama Equipment |
| Rarity | Badge warna |
| Level | Level saat ini |
| Type | Weapon/Armor/Helmet/Accessory |
| Stats | Primary stat |
| Status | Equipped / Available / Locked |

Sorting:
- By Rarity (naik/turun)
- By Level (naik/turun)
- By Type
- By Stat

Filter:
- By Rarity
- By Type
- By Equipped/Available

---

15. EQUIPMENT INSTANCE vs DEFINITION

DEFINITION (static, tidak berubah):
- equipment_id: "weapon_iron_sword_001"
- name: "Iron Sword"
- type: WEAPON
- rarity: COMMON
- base_atk: 100
- max_level: 20
- allowed_classes: [SWORDMAN, TANK]

INSTANCE (per player, berubah):
- instance_id: "uuid-xxxx"
- equipment_id: "weapon_iron_sword_001"
- player_id: "player-xxxx"
- current_level: 12
- actual_atk: 150 (100 base + 50 level bonus)
- bonus_crit: +3%
- is_locked: false
- equipped_to: "hero_instance_yyyy"

Jangan menyimpan semua Equipment sebagai satu static object. Setiap Equipment yang dimiliki pemain = 1 instance.

---

16. EQUIP FLOW

Player membuka Hero Detail
    ↓
Lihat Equipment Slot (4 slot: Weapon, Armor, Helmet, Accessory)
    ↓
Tap slot kosong → Equipment Inventory terbuka
    ↓
Filter/Sort Equipment
    ↓
Pilih Equipment
    ↓
Lihat Comparison (Current vs New)
    ↓
Tap "Equip"
    ↓
Server Validate:
  - Equipment owned
  - Equipment tidak sedang dipakai hero lain
  - Class compatible
    ↓
Equipment dipasang ke hero
    ↓
Hero Stats diperbarui
    ↓
Data disimpan
    ↓
UI update

---

17. UNEQUIP

Flow:

Tap Equipment di slot
    ↓
Pilihan: Equip lain / Unequip
    ↓
Jika Unequip:
  - Equipment kembali ke Inventory
  - Hero stats berkurang
  - Slot menjadi kosong
    ↓
Server Validate & Save

Unequip TIDAK menghancurkan Equipment.

---

18. REPLACE EQUIPMENT

Flow:

Tap slot yang sudah terisi
    ↓
Equipment Inventory terbuka
    ↓
Pilih Equipment baru
    ↓
Tap "Equip" (otomatis replace)
    ↓
Equipment lama → Inventory
    ↓
Equipment baru → Slot
    ↓
Stats diperbarui

---

19. DUPLICATE EQUIPMENT

Untuk versi awal:
- Duplicate Equipment disimpan di Inventory (bisa punya banyak)
- Belum ada sistem Sell/Fusion

PROPOSAL — FUTURE:
- Sell: Equipment → Gold
- Dismantle: Equipment → Equipment Shard
- Fusion: 2 Equipment sama → Equipment +1

Untuk sekarang, cukup simpan semua. Player bisa equip ke hero berbeda atau menunggu sistem Sell/Fusion.

---

20. EQUIPMENT POWER

Equipment contribution ke Hero Power:

Equipment Power = Σ (stat_value × stat_weight)

Contoh weight:
- HP: 0.1
- ATK: 1.0
- DEF: 0.5
- SPD: 2.0
- CRIT Rate: 10.0
- CRIT DMG: 5.0
- Skill Power: 0.8
- Heal Power: 0.8

Total Hero Power = Base Power + Level Power + Star Power + Equipment Power

HERO POWER bukan satu-satunya indikator kekuatan. Hero Power = indikator UI, bukan gameplay logic.

---

21. STAT CALCULATION (TERPUSAT)

Satu sistem perhitungan stat:

Final Stats = Base Stats + Level Bonus + Star Bonus + Equipment Bonus

Contoh Swordman HP:
- Base HP: 800
- Level Bonus (Level 50): +800 × 1.8% × 49 = +705
- Star Bonus (★★★ 30%): +800 × 30% = +240
- Equipment Bonus (Armor +150 HP): +150
- Final HP: 800 + 705 + 240 + 150 = 1.895

Semua Battle System membaca Final Stats. Tidak ada penghitungan sendiri-sendiri.

---

22. EQUIPMENT SET BONUS

TIDAK diimplementasikan penuh pada fase ini.

Arsitektur disiapkan:

set_definition:
  set_id: "iron_set"
  name: "Iron Set"
  pieces: [WEAPON, ARMOR, HELMET, ACCESSORY]
  bonuses:
    - 2 pieces: +10% DEF
    - 4 pieces: +15% HP

Status: FUTURE FEATURE (hanya interface/structure, belum active)

---

23. EQUIPMENT LOCK

Equipment yang di-lock:
- Tidak dapat dijual (ketika sistem Sell ada)
- Tidak dapat dihancurkan
- Tidak dapat digunakan sebagai material

Untuk versi awal: Lock system boleh ditunda jika Sell/Fusion belum ada.

PROPOSAL — aktifkan ketika sistem Sell/Fusion diimplementasikan.

---

24. EQUIPMENT COMPARISON UI

Saat player memilih Equipment baru:

| Stat | Current | New | Diff |
|------|---------|-----|------|
| ATK | 120 | 145 | +25 ↑ |
| CRIT | 2% | 4% | +2% ↑ |
| HP | 0 | 30 | +30 ↑ |

Indikator:
- ↑ hijau = lebih baik
- ↓ merah = lebih buruk
- = abu-abu = sama

---

25. EQUIPMENT REWARD POPUP

Integrasi dengan RewardPopup dari Phase 5:

VICTORY
Rewards:
+500 Gold
+20 XP
+1 Epic Equipment "Flame Sword"

Tap Equipment → buka Equipment Detail

---

26. SERVER AUTHORITY

Server memvalidasi:
- Equipment ownership
- Equipment instance
- Equipment level (tidak bisa melebihi max)
- Gold untuk upgrade
- Material untuk upgrade
- Class restriction saat equip
- Equipment tidak sedang dipakai hero lain

Client tidak boleh membuat Equipment sendiri.

---

27. TRANSACTION SAFETY

Gunakan Idempotency dari Phase 6.

Equipment Upgrade:
Request → Validate ownership → Check cost → Deduct → Upgrade → Save → Return result

Jika request dikirim dua kali:
- Request ID sudah ada di processed_operations
- Server kembalikan hasil pertama
- Tidak ada upgrade/material duplikasi

---

28. DATA STRUCTURE

Static Configuration:
- EquipmentDefinition: id, name, type, rarity, base_stats, max_level, allowed_classes
- EquipmentUpgradeConfig: base_cost, growth_rate
- EquipmentDropTable: stage/boss → rarity → chance
- EquipmentMaterial: id, name, sources, drop_rates

Player Data:
- player_equipments: instance_id, equipment_id, player_id, current_level, bonus_stats, is_locked, equipped_to
- player_equipment_materials: player_id, material_id, count

Hubungan:
- EquipmentDefinition ↔ EquipmentInstance (1:N)
- EquipmentInstance ↔ PlayerHero (N:1 via equipped_to)
- PlayerInventory (bisa hold semua EquipmentInstance + Material)

---

29. INTEGRATION DENGAN PHASE SEBELUMNYA

Equipment terintegrasi dengan:

Phase 2 (Hero System):
- Equipment menambah stat Hero (Final Stats calculation)
- Equipment respect class restriction

Phase 4 (Progression):
- Equipment drop dari stage/boss reward
- Equipment upgrade pakai Gold (sink economy)

Phase 5 (UI/UX):
- Equipment Screen: Inventory, Detail, Equip, Comparison
- Reward Popup: Equipment reward

Phase 6 (Backend):
- Server Authority untuk semua operasi Equipment
- Idempotency untuk upgrade/equip
- Transaction Safety

Phase 7 (Quest/Achievement):
- Quest "Equip 3 Hero dengan Equipment Epic+"
- Achievement "Upgrade 10 Equipment ke Level max"

---

30. TESTING

EQUIPMENT:
- [ ] Mendapatkan Equipment dari battle/boss
- [ ] Equipment masuk Inventory
- [ ] Equip ke Hero
- [ ] Unequip dari Hero
- [ ] Replace Equipment
- [ ] Duplicate Equipment tersimpan

STATS:
- [ ] Equipment meningkatkan stat Hero
- [ ] Unequip mengurangi stat
- [ ] Upgrade meningkatkan stat
- [ ] Final Stats calculation benar
- [ ] Hero Power diperbarui

UPGRADE:
- [ ] Cost benar sesuai formula
- [ ] Gold berkurang sesuai
- [ ] Material berkurang sesuai
- [ ] Equipment level naik
- [ ] Stats naik sesuai level
- [ ] Tidak bisa upgrade tanpa resource
- [ ] Tidak bisa upgrade melebihi max level

CLASS RESTRICTION:
- [ ] Weapon Sword hanya bisa dipakai Swordman/Tank
- [ ] Weapon Staff hanya bisa dipakai Mage/Healer
- [ ] Class lain ditolak

SECURITY:
- [ ] Client tidak bisa membuat Equipment
- [ ] Ownership divalidasi server
- [ ] Duplicate request dicegah (idempotency)
- [ ] Equipment tidak bisa di-upgrade tanpa ownership

PERSISTENCE:
- [ ] Equipment tersimpan setelah logout
- [ ] Equip status tersimpan
- [ ] Upgrade tersimpan
- [ ] Reconnect aman
- [ ] Restart App aman

---

31. DEVELOPMENT TOOLS

HANYA Development/Test:

| Tool | Fungsi |
|------|--------|
| give_equipment | Berikan Equipment ke player |
| set_equip_level | Set level Equipment |
| add_material | Tambah Equipment Shard |
| remove_equipment | Hapus Equipment |
| reset_inventory | Reset seluruh Inventory |
| test_drop | Simulate drop dari stage/boss |

Tidak boleh tersedia di Production.

---

32. BALANCING

Equipment HARUS menjadi peningkatan, bukan satu-satunya sumber kekuatan.

Pertimbangan:
- Hero tanpa Equipment masih bisa melawan stage awal
- Equipment Epic+ memberikan advantage signifikan tapi tidak OP
- Upgrade cost naik cukup cepat untuk mengontrol progression
- Gold economy tidak rusak karena Equipment upgrade
- Material drop cukup untuk 1-2 upgrade per minggu bagi F2P

Semua angka TENTATIVE — NEEDS PLAYTEST.

---

33. BATASAN PHASE 8

JANGAN dibangun mendalam:
- Equipment Trading
- Equipment Marketplace
- NFT Equipment
- Player-to-Player Trading
- PvP Equipment Meta
- Blockchain Equipment
- GRAM Equipment Economy
- Complex Crafting
- Complex Set System (hanya arsitektur disiapkan)
- Random Bonus Stats (untuk versi awal, bonus tetap)

---

34. FINAL DECISIONS

- 4 Equipment Slot: Weapon, Armor, Helmet, Accessory
- Equipment class restriction: beberapa class (bukan semua, bukan 1)
- 8 stat types (HP, ATK, DEF, SPD, CRIT Rate, CRIT DMG, Skill Power, Heal Power) — stat yang sudah ada
- Equipment Level: Common 20, Rare 30, Epic 40, Legendary 50, Mythic 60
- 1 material type: Equipment Shard
- Equipment drop dari Boss 100%, stage farming juga tersedia
- Drop Table berbasis configuration
- Stat Calculation terpusat (Base + Level + Star + Equipment)
- Server Authority untuk semua operasi Equipment
- Idempotency untuk upgrade/equip
- Equipment Set: arsitektur disiapkan, implementasi FUTURE FEATURE
- Equipment Lock: aktifkan ketika Sell/Fusion ada
- Sell/Fusion: FUTURE FEATURE
- Random Bonus Stats: FUTURE FEATURE (untuk versi awal, bonus tetap)

---

35. PROPOSAL

- Random Bonus Stats pada Equipment (jika roll stat random menambah variasi build)
- Equipment Sell/Dismantle (Equipment → Gold atau Shard)
- Equipment Fusion (2 Equipment sama → Upgrade)
- Equipment Set Bonus (2 pieces / 4 pieces bonus)
- Equipment Lock (prevent sell/dismantle)
- Crafting: buat Equipment dari material

---

36. TENTATIVE — NEEDS PLAYTEST

- Equipment stat values (base per rarity)
- Upgrade cost formula (base 200, growth 1.15x)
- Material drop rates (1-2 Common, 3-5 Rare, 5-8 Epic, 10-20 Boss)
- Drop chances per stage/boss
- Growth per level (+5% Common, +4% Epic, +3% Mythic)
- Hero Power weight per stat
- Max inventory size (50/100/200?)
- Equipment comparison UI layout

---

37. FUTURE FEATURE

- Equipment Set Bonus
- Equipment Sell/Dismantle
- Equipment Fusion
- Random Bonus Stats
- Equipment Lock
- Equipment Crafting
- Equipment Trading
- NFT Equipment
- PvP Equipment Meta
- GRAM Equipment Economy

---

38. OPEN QUESTIONS

- Apakah 4 slot sudah cukup atau perlu 5-6 slot?
- Equipment class restriction: 2 class atau 3 class per item?
- Bonus stat: tetap atau random untuk versi awal?
- Equipment Set: aktifkan di fase ini atau tunda?
- Max inventory size berapa?
- Equipment shard dari dismantle: apakah perlu diimplementasikan sekarang?

---

39. PHASE 8 COMPLETION CHECKLIST

EQUIPMENT
- [x] Equipment Definition (static data)
- [x] Equipment Instance (per player)
- [x] Equipment Slot (4 slot: Weapon, Armor, Helmet, Accessory)
- [x] Equip flow
- [x] Unequip flow
- [x] Replace flow
- [x] Inventory

STATS
- [x] Equipment Stats (8 stat types)
- [x] Final Hero Stats calculation (terpusat)
- [x] Hero Power integration
- [x] Stat Calculation: Base + Level + Star + Equipment

UPGRADE
- [x] Equipment Level (per rarity)
- [x] Upgrade flow (server validated)
- [x] Gold cost (configuration-based)
- [x] Material (Equipment Shard)
- [x] Validation (ownership, cost, max level)

DROP
- [x] Drop Table (configuration-based)
- [x] Stage Reward
- [x] Boss Reward
- [x] Equipment dari stage/boss/quest

SECURITY
- [x] Server Authority
- [x] Ownership Validation
- [x] Transaction Safety
- [x] Idempotency (duplicate request protection)

UI
- [x] Inventory screen
- [x] Equipment Detail screen
- [x] Equip/Unequip UI
- [x] Upgrade UI
- [x] Comparison UI
- [x] Reward Popup integration

ASSETS
- [x] Asset terpisah dari Logic
- [x] Placeholder dapat diganti
- [x] Equipment Icon reference (asset_reference, bukan hardcode)
- [x] UI tidak bergantung pada artwork tertentu

FINAL RULE: Jangan mulai Phase 9. HANYA Phase 8.

