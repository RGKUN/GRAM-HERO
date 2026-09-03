GRAM AFK HEROES — CORE GAME FOUNDATION

1. GAME VISION
GRAM AFK HEROES adalah pixel RPG mobile/Telegram Mini App bergenre PvE-focused dengan sistem AFK/Auto Battle. Game dirancang untuk sesi pemain yang singkat maupun lama, dengan koleksi hero (gacha) sebagai driver utama progression, serta ekonomi Web3 dengan token GRAM yang terintegrasi namun tidak mendominantkan gameplay non-crypto.

Target pengalaman: "Mudah dimainkan, cocok untuk sesi singkat maupun AFK, tetapi memiliki progression dan collectible system yang membuat pemain ingin terus berkembang."

2. CORE GAMEPLAY LOOP
PLAYER START BATTLE
↓
KOROCO DISUMMON (monster tingkat rendah pertama)
↓
HERO MELAWAN KOROCO (3 hero aktif maksimal)
↓
KOROCO DIKALAHKAN (memberi XP & Gold)
↓
WAVE BERIKUTNYA (skala naik: wave 1 → sedikit koroco, wave 3 → kuat, dst)
↓
BOSS MUNCUL (15 boss archetype berbeda, mekanik unik per boss)
↓
BOSS DIKALAHKAN
↓
REWARD (Gold, XP, kemungkinan Diamond/GRAM tertentu)
↓
PROGRESSION (level up, hero collection, gacha)

3. BATTLE SYSTEM
BATTLE STATE:
- Active: battle sedang berlangsung
- Paused: battle dijeda (AFK mode)
- Victory: semua enemy dikalahkan
- Defeat: semua hero HP habis

WAVE:
- Setiap wave mengandalkan jumlah Koroco yang meningkat
- Wave 1: 2-3 Koroco
- Wave 2: 4-5 Koroco
- Wave 3: 3 Koroco + 1 Koroco "power-up"
- Setiap wave selanjutnya: scaling difficulty

KOROCO SPAWNING:
- Monster tingkat rendah, tidak bersifat kompleks
- Fungsi: lawan awal, sumber XP & Gold
- Tidak ada mechanic khusus Koroco selain HP/ATK dasar

HERO ACTION:
- 3 hero aktif maksimum per battle
- Posisi: FRONT (Swordman, Tank) atau BACK (Mage, Healer)
- Setiap hero memiliki action sendiri per ronde

BASIC ATTACK:
- Berjalan otomatis setelah battle dimulai
- Menghasilkan Energy (1-3 per attack tergantung balancing)
- Berlanjut hingga enemy mati atau Energy 100

SKILL:
- Setiap hero memiliki skill unik per class
- Auto Battle: skill digunakan AI berdasarkan priority
- Manual: pemain menentukan target & timing

ULTIMATE:
- Diaktifkan ketika Energy mencapai 100
- Bisa digunakan otomatis Auto Battle atau manual player
- Skill power menentukan damage/heal effectiveness

VICTORY:
- Boss atau semua enemy dikalahkan
- Memberikan reward dan XP

DEFEAT:
- Semua hero HP habis
- Battle berakhir, menerima penalty (retry atau return to map)

REWARD:
- Gold: untuk level hero & progression
- XP: untuk progression hero
- Diamond: untuk gacha (tersedia di wave/boss tertentu)
- GRAM: reward terkontrol, tidak dari setiap Koroco

4. HERO ARCHITECTURE
CLASS (4 utama):
- SWORDMAN: DPS, single-target physical, FRONT position
- TANK: DEFender, HP tinggi, DEF tinggi, FRONT position (protection)
- MAGE: Burst DPS, AoE magic, BACK position
- HEALER: Support, healing, BACK position (sustain)

POSITION:
- FRONT: terima damage lebih, melindungi BACK
- BACK: jarang terima damage langsung, fokus skill

MAX ACTIVE HERO: 3 hero per battle

HERO STATISTICS (basic):
- HP (Health Points)
- ATK (Attack Damage)
- DEF (Damage Reduction)
- SPD (Speed/turn order)
- CRIT Rate
- CRIT DMG
- Skill Power
- Heal Power
- Energy (0-100)

LEVEL:
- Hero dapat level up melalui XP dari battle
- Setiap level up: stats naik, skill mungkin unlock potency baru

ENERGY:
- Rentang: 0 → 100
- Basic Attack memberikan Energy
- Damage yang diterima memberikan Energy kecil
- Ketika 100: Ultimate Ready
- Energy generation TENTATIVE, akan di-balance di phase selanjutnya

5. MONSTER & KOROCO ARCHITECTURE
KOROCO:
- Monster tingkat rendah, nama khusus (BUKAN crocodile)
- HP & ATK dasar
- Memberi XP dan Gold khi dikalahkan
- Muncul per wave

WAVE SCALING:
- Wave 1: 2-3 Koroco (base stats)
- Wave 2: 4-5 Koroco, stats +20%
- Wave 3: 3 Koroco + 1 "Elite" Koroco (HP x1.5, ATK x1.3)
- Setiap wave selanjutna: scaling difficulty = base × 1.15^(wave-1)

BOSS:
- 15 boss archetype untuk versi awal
- Setiap boss memiliki identitas/mechanik unik (lihat section 6)
- Dilawan berurutan setelah wave selesai
- Memberi reward lebih besar (Gold, Diamond, GRAM terlimit)

6. BOSS SYSTEM
15 BOSS ARCHETYPE (contoh conceptual, belum semua dibuat detail):
1. Boss DEF Tinggi - reduc damage fisik
2. Boss AoE - attack berlautan menyaluti seluruh tim
3. Boss Lifesteal - memulihkan HP saat menyerang
4. Boss Rage - ATK naik drastis ketika HP < 30%
5. Boss Shield - memiliki shield yang harus di-break pertama
6. Boss Speed - SPD sangat tinggi, turn order mematuhi boss
7. Boss Poison - memberikan DOT ke hero
8. Boss Summon - memanggil Koroco bantuan
9. Boss Crit - memiliki CRIT Rate tinggi
10. Boss Tank - memiliki DEF ekstra tinggi seperti player Tank
11. Boss Healer - memulihkan HP minion sendiri
12. Boss Block - bisa memblok attack tertentu
13. Boss Berserk - saat HP rendah, attack speed naik
14. Boss Vulnerable - memiliki weakness element tertentu
15. Boss Support - membuff/heal minion lainnya

SETIAP BOSS MEMPUNYAI:
- HP pool unik
- 1-2 mechanic khusus
- Reward table berbeda
- Visual identifikasi yang jelas

7. CURRENCY OVERVIEW
GRAM:
- Token utama Web3/on-chain
- Tidak boleh diberikan dari setiap Koroco
- Supply/reward lebih terkontrol
- Digunakan untuk: gacha hero, gacha skill, marketplace (phase 2+)
- Tokenomics belum final (future feature)

DIAMOND:
- Digunakan terutama untuk gacha hero & gacha skill
- Dapat diperoleh dari: boss reward, quest completion, milestone
- Economy lebih terkontrol daripada GRAM

GOLD:
- Currency utama untuk progression gameplay
- Sumber: Koroco, boss, quest
- Digunakan untuk: level hero, upgrade tertentu, progression dasar
- Ekonomi stabil untuk core gameplay

HUBUNGAN:
- Gold → progression gameplay sehari-hari
- Diamond → gacha (hero/skill)
- GRAM → Web3 layer, economia panjang jangkau

8. PROGRESSION FLOW
NEW PLAYER
→ Starter Hero (pilih 1 dari 4 class: Swordman, Tank, Mage, Healer)
→ Battle (tutorial battle, wave Koroco)
→ XP & Gold reward
→ Level Up (stats naik, hero kuat)
→ Reward (Gold, kemungkinan Diamond)
→ Gacha (gunakan Diamond untuk summon hero baru)
→ Hero Collection (accumulate hero)
→ Boss Progression (face increasingly difficult boss)
→ Repeat loop dengan hero collection yang lebih kuat

9. CURRENT FINAL DECISIONS (batasan Phase 1)
- 4 class hero utama dengan role spesifik
- 3 hero aktif maksimum per battle
- Basic attack otomatis, skill manual/auto berdasarkan setting
- Energy 0-100, Ultimate saat ready
- 3 currency: Gold, Diamond, GRAM (peran berbeda)
- 15 boss archetype conceptual (belum detail lengkap)
- Koroco sebagai monster wave basic
- Tidak ada: marketplace, trading, PvP, guild, equipment complex, tokenomics lengkap, withdrawal, NFT, blockchain kompleks

10. PROPOSED DECISIONS (propoals untuk diskusi)
- Proposal: Menambah statistik "Hit Rate" sebagai pengganti accuracy/dodge sederhana (PROPOSAL - BELUM FINAL)
- Proposal: Energy generation rate per basic attack = 5 (TENTATIVE, butuh balancing)
- Proposal: Gold reward dari Koroco = 10-50 per battle (TENTATIVE)
- Proposal: Diamond reward dari boss = 5-20 per boss (TENTATIVE)
- Proposal: GRAM reward hanya dari milestone/achievement, bukan battle sehari-hari

11. OPEN QUESTIONS
- Energy generation balancing: berapa Energy per basic attack?
- Gold reward scaling: seberapa cepat gold naik per wave?
- Diamond reward frequency: seberapa sering diamond diberikan?
- GRAM economy: apa batasan reward GRAM per pemain per hari/minggu?
- Boss mechanic detail: 15 boss archetype mana yang akan didefinisikan detail pertama?
- Skill AI priority: bagaimana Auto Battle memilih skill target?

12. PHASE 1 COMPLETION CHECKLIST
□ Game vision terdefinisi
□ Core gameplay loop terdocument
□ Battle architecture complete (state, wave, koroco, boss, hero action)
□ Hero architecture complete (class, position, role, stats, energy)
□ Monster & Koroco architecture complete
□ Boss system architecture defined (15 archetype conceptual)
□ Currency architecture complete (Gold, Diamond, GRAM relationship)
□ Progression flow complete (new player sampai boss progression)
□ Aturan Phase 1 tercatat (10 aturan utama)
□ PROPOSAL/TENTATIVE markers terpasang untuk angka belum final
✖ Semua fitur Phase 2 (marketplace, trading, PvP, dll) terkecuali disebut sebagai future

