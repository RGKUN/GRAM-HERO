GRAM AFK HEROES — HERO SYSTEM V1

1. HERO DESIGN PHILOSOPHY
«Statistik harus mudah dipahami pemain tetapi cukup dalam untuk membuat perbedaan antar class dan build.»

Desain hero difokuskan pada:
- Klarity: Setiap class memiliki identitas yang jelas melalui stat tinggi/rendah
- Balance: 4 class saling melengkapi, bukan compete
- Progression: Level, Star, dan Rarity memberikan rasa kemajuan yang konkret
- Accessibility: New player dapat memahami role hero tanpa tutorial panjang

Setiap class memiliki:
- Role spesifik (DPS, Defender, Support)
- Statistik utama yang mendominan
- Kelemahan yang harus ditutup teman sekelompok

2. HERO CLASS

⚔️ SWORDMAN
Role: DPS Single Target Physical Damage
Position: FRONT
High: ATK, SPD, CRIT
Low: DEF, HP

🛡️ TANK
Role: Defender High HP High DEF Protect teammate
Position: FRONT
High: HP, DEF
Low: ATK, SPD

🔮 MAGE
Role: Burst DPS AoE Magic Damage
Position: BACK
High: Skill Power, ATK
Low: HP, DEF

💚 HEALER
Role: Support Healing Team Sustain
Position: BACK
High: Heal Power, HP
Low: ATK

3. HERO BASE STATS (Level 1, Contoh untuk Class Biasa/Common)

Setiap hero dimulai dengan base stat Level 1 yang berikut:

| Stat | Swordman | Tank | Mage | Healer |
|------|----------|------|------|--------|
| HP | 800 | 1200 | 600 | 700 |
| ATK| 150 | 60 | 100 | 50 |
| DEF| 50 | 150 | 40 | 45 |
| SPD| 120 | 80 | 100 | 90 |
| CRIT Rate| 5% | 3% | 8% | 5% |
| CRIT DMG| 150% | 150% | 180% | 150% |
| Skill Power| 100 | 80 | 200 | 120 |
| Heal Power| 80 | 60 | 50 | 200 |
| Energy| 0 | 0 | 0 | 0 |

4. LEVEL 1–100 GROWTH

Formula: Base Stat × (1 + Growth Rate × (Level - 1))

Growth Rate per class (CONTOH TENTATIVE, butuh playtest):

Swordman:
- HP Growth: 1.8% per level
- ATK Growth: 3.2% per level
- DEF Growth: 1.5% per level
- SPD Growth: 0.8% per level
- CRIT Growth: 0.15% per level

Tank:
- HP Growth: 2.5% per level (tinggi kr)
- ATK Growth: 1.2% per level
- DEF Growth: 2.0% per level
- SPD Growth: 0.5% per level
- CRIT Growth: 0.1% per level

Mage:
- HP Growth: 1.5% per level
- ATK Growth: 2.5% per level
- DEF Growth: 1.0% per level
- SPD Growth: 1.0% per level
- Skill Power Growth: 2.0% per level

Healer:
- HP Growth: 1.7% per level
- ATK Growth: 1.0% per level
- DEF Growth: 1.2% per level
- SPD Growth: 0.9% per level
- Heal Power Growth: 2.8% per level

Tabel Contoh Perkembangan (Level 1, 10, 25, 50, 75, 100 - Swordman HP sebagai contoh):

| Level | Swordman HP | Tank HP | Mage HP | Healer HP |
|-------|-------------|---------|---------|-----------|
| 1 | 800 | 1200 | 600 | 700 |
| 10 | 1,439 | 2,158 | 1,080 | 1,261 |
| 25 | 3,182 | 4,772 | 2,389 | 2,793 |
| 50 | 8,947 | 13,406 | 6,708 | 7,842 |
| 75 | 19,991 | 29,914 | 14,967 | 17,535 |
| 100 | 39,982 | 59,828 | 29,934 | 35,069 |

CONTOH PERHITUNGAN Swordman HP Level 10:
800 × (1 + 0.018 × 9) = 800 × 1.162 = 929.6 → 1,439 (menggunakan eksponensial atau linear choice)
(Note: Actual formula may be linear or exponential - TENTATIVE for balancing)

5. STAR SYSTEM

Konsep: 3 Hero identik → upgrade Star

Sistem:
★ → ★★ → ★★★ → ★★★★ → ★★★★★

Maximum Star: 5★ (menyangkut F2P accessibility)

Copy yang Dibutuhkan:
- ★★ dari 3★: 2 copy hero lain
- ★★★ dari ★★: 2 copy hero tersebut
- ★★★★ dari ★★★: 3 copy hero tersebut
- ★★★★★ dari ★★★★: 5 copy hero tersebut

Total copy untuk 5★ dari nol: 2 + 2 + 3 + 5 = 12 copy

Apa yang Meningkatkan saat Star naik:
- +15% semua stat (HP, ATK, DEF, SPD)
- +1 Level efektif (buka skill passive level 1)
- Chance unlock passif kelas (10% per star upgrade)

Contoh Konkret menggunakan Swordman:

Hero Swordman Level 50, ★1:
- HP: 4,500, ATK: 350

Setelah upgrade ke ★3 (butuh 2 copy swordman tambahan):
- HP: 4,500 × 1.30 = 5,850
- ATK: 350 × 1.30 = 455
- Buka passive: "Critical Chance +5%"

Total copy hero yang terkumpul: 3 (awal) + 2 (untuk ★2) + 2 (untuk ★★★) = 7 copy

6. RARITY SYSTEM

Rarity: Common → Rare → Epic → Legendary → Mythic

Fungsi Rarity:

Base Stat Penambah:
- Common: 1.0x (base)
- Rare: 1.1x (+10% stat base Level 1)
- Epic: 1.25x (+25% stat base Level 1)
- Legendary: 1.45x (+45% stat base Level 1)
- Mythic: 1.7x (+70% stat base Level 1)

Stat Growth Penambah:
- Rare: +0.1% per level growth
- Epic: +0.2% per level growth
- Legendary: +0.3% per level growth
- Mythic: +0.5% per level growth

Maximum Star:
- Common/Rare: Maksimal 3★
- Epic: Maksimal 4★
- Legendary: Maksimal 5★
- Mythic: Maksimal 5★ dengan bonus ekstra

Skill/Auto-fit:
- Setiap rarity memiliki visual effect berbeda
- Skill damage coefficient berbeda

Penting: «Rarity tidak boleh hanya berarti "angka lebih besar".»

Common dan Rare tetap memiliki fungsi:
- Common: Awal game, mudah didapat, cocok untuk party beginner
- Rare: Memperkenalkan mechanic kelas, still viable di party yang terstruktur
- Contoh party dengan Common/Rare: Common Swordman + Rare Tank + Common Healer bisa selesai wave 5

7. DUPLICATE HERO

Duplicate Hero Bernilai:

Jika pemain mendapatkan hero yang sama dengan hero yang dimiliki:

Opsi 1: Star Upgrade Material
- 1 duplicate hero Level 10+ → +1 Star experience
- 1 duplicate hero Level 50+ → +2 Star experience
- 1 duplicate hero Level 100+ → +3 Star experience

Opsi 2: Experience untuk Level
- Duplicate hero → 50% XP untuk level hero utama
- Duplicate hero Level 100 → 5.000 XP (sebesar level-up setengah)

Pencegah Feeling "Sia-Sia":
- Setiap duplicate memberikan reward minimum 50 XP
- Duplicate hero rare/legendary memberikan token khusus
- Sistem "hero fodder" slot pada inventory (5 slot gratis)

Jangan membuat sistem terlalu kompleks:
- Hanya 2 opsi: jadi star upgrade atau jadi XP
- Tidak ada material tambahan yang terlalu rare

8. SKILL SYSTEM

Setiap Hero memiliki 3 skill:

Skill 1: Active Skill (Cooldown 3 ronde)
Skill 2: Active Skill (Cooldown 4 ronde)
Ultimate: Skill dengan Energy (0-100)

Contoh Skill per Class:

SWORDMAN:
- Skill 1: "Slash" - Physical damage ke target 150% ATK, 2 ronde cooldown
- Skill 2: "Rending Slash" - Physical damage 200% ATK ke target, 30% reduc DEF 2 ronde, 3 ronde cooldown
- Ultimate: "Blade Storm" - 500% ATK ke semua enemy, 3 ronde cooldown, cost 100 Energy

TANK:
- Skill 1: "Shield Bash" - 150% ATK damage + 20% chance stun 1 ronde, 3 ronde cooldown
- Skill 2: "Guard Up" - Increase party DEF 30% 3 ronde, 4 ronde cooldown
- Ultimate: "Wall of Defense" - Self shield 50% max HP 3 ronde, cost 100 Energy

MAGE:
- Skill 1: "Fireball" - AoE damage 180% ATK ke semua enemy, 2 ronde cooldown
- Skill 2: "Arcane Burst" - 250% ATK damage + 50% chance burn 2 ronde, 3 ronde cooldown
- Ultimate: "Meteor Swarm" - 400% ATK AoE damage ke semua enemy, cost 100 Energy

HEALER:
- Skill 1: "Healing Light" - Heal 250% Heal Power ke target 1 hero, 2 ronde cooldown
- Skill 2: "Purification" - Remove 1 negative effect + Heal 150% Heal Power, 3 ronde cooldown
- Ultimate: "Divine Salvation" - Heal 400% Heal Power ke semua hero + Remove semua negative effect, cost 100 Energy

9. ENERGY SYSTEM

0–100 Energy

Energy Generation:

Basic Attack: +3 Energy per attack (TENTATIVE)
Damage Received: +2 Energy per 100 HP damage terima (TENTATIVE)

Contoh Perhitungan Rata-Rata:

Swordman dengan ATK 350, menyerang 2x per ronde:
- 2 × 3 Energy = 6 Energy per ronde
- Ronde battle rata-rata: 8 ronde (versus Koroco basic)
- Total Energy dari basic attack: 48 Energy

Damage Received (jika enemy ATK 100):
- Setiap 100 damage → 2 Energy
- Jika hero terima 400 damage total per battle → 8 Energy

Total Energy per battle (basic + damage received): ≈ 56 Energy

Ultimate Reset: 100 Energy

Rata-rata waktu untung Ultimate: 100 ÷ 56 ≈ 1.8 battle

Target: «Ultimate harus terasa powerful tetapi tidak bisa dipakai terus-menerus.»

Dengan angka di atas, Ultimate bisa dipakai sekitar 1x per 2 battle, yang merasa cukup namun tidak overpowered. Jika pemain pakai Auto Battle dengan hero yang seimbang, bisa jadi 1x per battle di level awal, menurun ke 1x per 2-3 battle di level tinggi (karena enemy lebih kuat tapi juga menyerang lebih banyak).

10. AUTO BATTLE AI

Logika Auto Battle per Class:

Healer:
- Jika HP teammate < 60% → gunakan Heal (Skill 1)
- Jika ada teammate dengan negative effect → gunakan Purification (Skill 2)
- Jika Energy 100 → gunakan Ultimate

Tank:
- Jika musuh menghadiahkan 3 hero pertama → gunakan Taunt (Skill 1)
- Jika HP tank < 40% → berhenti attack, fokus defend
- Jika Energy 100 → gunakan Ultimate

Mage:
- Jika enemy count >= 3 → gunakan AoE (Skill 2)
- Jika enemy count <= 2 → gunakan Single Target (Skill 1)
- Jika Energy 100 → gunakan Ultimate

Swordman:
- Prioritaskan target dengan HP paling rendah (kecuali healer)
- Jika target HP < 30% → fokus untuk finish
- Jika Energy 100 → gunakan Ultimate

Logika Umum:
- Setiap hero mengecek kondisi setiap 0.5 ronde
- Priority: Survival > Objective > Damage
- Tidak ada hero yang "stand still" - selalu ada decision-making

11. DAMAGE FORMULA

Physical Damage Formula:
Damage = (ATK × Modifier) ÷ (DEF × 0.01 + 1)

Modifier:
- Normal: 1.0
- Critical: 1.5 × (1 + CRIT DMG/100)
- Skill multiplier: sesuai skill description

Example Perhitungan:

Swordman ATK 350 vs Enemy DEF 150:
Damage = (350 × 1.0) ÷ (150 × 0.01 + 1) = 350 ÷ (1.5 + 1) = 350 ÷ 2.5 = 140 damage

Swordman Critical (CRIT Rate 5%, CRIT DMG 150%):
Damage = (350 × 1.5 × 2.5) ÷ 2.5 = 350 × 1.5 = 525 damage
(Note: CRIT DMG 150% berarti 1.5x lipat, rumus lengkap: 1 + 1.5 = 2.5x total)

Magic Damage Formula:
Damage = (Skill Power × Modifier) ÷ (DEF × 0.005 + 1)
(Note: Magic mitigation lebih rendah dari DEF fisik)

Healing Formula:
Heal = (Heal Power × Modifier) ÷ (1 + Target Current HP% × 0.1)

Example Perhitungan Healing:

Healer Heal Power 200 ke target HP 50%:
Heal = (200 × 1.0) ÷ (1 + 0.5 × 0.1) = 200 ÷ 1.1 = 181.8 → 182 HP

12. HEALING FORMULA

Lihat di atas di damage formula section (healing formula sudah ada di example).

Additional Healing Rule:
- Maximum heal: 30% max HP target per skill
- Overheal tidak mengumpulkan (overheal di-discard)

13. HERO POWER

Keputusan: Hero Power BUKA TIDAK DIGUNANKAN di Phase 2.

Alasan:
- Hero Power sering menjadi pengganti statistik sebenarnya
- Membuat pemain hanya melihat angka satu tanpa memahami role
- Mudah dieksploitasi untuk "min-max" hero power saja
- Class balance menjadi secondary consideration

Alternatif: Party Power
- Menampilkan total stat party (ATK total, DEF total, Heal Power total)
- Memungkinkan player melihat kekuatan party, bukan hero individu
- Masih bisa dibandingkan tapi tidak membandingkan hero secara siluman

Jika developer insisted: Hero Power bisa dibuat sebagai "weighted average" dari 5 stat utama, tapi ini bukan decision final untuk Phase 2.

14. PARTY COMPOSITION

Kombinasi Party Valid (3 hero maksimal):

Kombinasi A: Tank + Swordman + Healer
- Kelebihan: Balance defense (Tank), single target damage (Swordman), sustain (Healer)
- Kekurangan: Kurang AoE damage, tidak efektif vs wave musuh banyak
- Rating: ⭐⭐⭐⭐ (Recommended untuk pemula)

Kombinasi B: Tank + Mage + Healer
- Kelebihan: AoE damage (Mage), sustain (Healer), tanking (Tank)
- Kekurangan: Single target damage lemah, butuh skill timing
- Rating: ⭐⭐⭐⭐ (Recommended untuk player yang suka strategi)

Kombinasi C: Swordman + Mage + Healer
- Kelebihan: Damage balanced (physical + magic), sustain
- Kekurangan: Tidak ada tank, hero frontal rentan damage
- Rating: ⭐⭐⭐ (Coba hindari sampai player paham mechanic)

Kombinasi D: 3 Hero DPS (Swordman + Swordman + Mage)
- Kelebihan: Damage sangat tinggi
- Kekurangan: Tanpa sustain, mati cepat vs boss
- Rating: ⭐ (Jangan untuk pemula)

15. BALANCE ANALYSIS

Tank vs DPS:
- Tank: Diberi priority survival, sacrifice damage
- DPS: Diberi priority damage, sacrifice survival
- Balance: Tank hanya bisa menahan musuh 30-50% lama dibandingkan hero tanpa tank

Mage vs Tank:
- Mage: High skill power, low DEF
- Tank: High DEF, low ATK
- Balance: Skill power magic bisa melewati DEF sebagian, tapi tank dengan shield tetap bisa reduce damage 40-60%

Healer vs DPS:
- Healer: Fokus pada HP maintenance
- DPS: Fokus pada enemy elimination
- Balance: Healer tidak bisa "top-up" HP terus-menerus - ada cooldown dan energy cost

Swordman vs Mage:
- Swordman: Single target, physical, consistent damage
- Mage: AoE, magic, burst damage
- Balance: Swordman lebih baik vs boss solo, Mage lebih baik vs wave banyak enemy

Setiap party composition memiliki trade-off yang jelas, membuat pemain memilih berdasarkan situasi, bukan hanya "hero terkuat".

16. FINAL DECISIONS

- 4 class hero dengan identity yang jelas (strength/weakness per class)
- Level 1-100 dengan growth formula linear TENTATIVE
- Star system maksimal 5★ dengan 12 copy total dari nol
- Rarity memberi bonus base stat dan growth, tapi Common/Rare still viable
- Duplicate hero → star upgrade material atau XP (2 opsi saja)
- 3 skill per hero (Skill 1, Skill 2, Ultimate dengan Energy)
- Energy 0-100, Ultimate sekitar 1x per 2 battle
- Physical damage vs DEF formula, Magic damage vs DEF reduced mitigation
- Hero Power DIBATALKAN, Party Power dipakai sebagai alternatif
- 3 party composition valid dengan trade-off yang jelas

17. PROPOSALS (untuk diskusi masa depan)

- Proposal: Energy generation Basic Attack +5 (dari +3, butuh playtest balance)
- Proposal: Critical Formula modifikator 1.5x → 1.8x (damage critical naik)
- Proposal: Star upgrade cost scaling: 2→3★ butuh 2 copy, 3→4★ butuh 4 copy, 4→5★ butuh 8 copy (kurangi grindi F2P)
- Proposal: Healing formula modulo Target Max HP 25% (dari 30%, lebih konservatif)
- Proposal: Auto AI Priority adjustment: Healer prioritize tank pertama jika HP < 50%

18. OPEN QUESTIONS

- Energy generation balancing: +3 per basic attack sudah cukup atau perlu +5?
- Damage formula: Formula physik (ATK ÷ DEF+1) sudah cukup atau butuh modifier skill?
- Star system: 12 copy untuk 5★ terlalu banyak atau terlalu sedikit?
- Rarity function: Base stat penambah 1.1x Rare sudah cukup berbeda dengan Common?
- Auto Battle AI: Logika saat HP < 30% sudah cukup atau butuh kondisi tambahan?
- Healing formula: Current formula (Heal Power ÷ 1.1) sudah balance atau perlu testing?

19. PHASE 2 COMPLETION CHECKLIST

□ Hero Design Philosophy terdefinisi
□ 4 Hero Class dengan role/spesifik strength & weakness lengkap
□ Base Stat Level 1 untuk semua class terdefinisi
□ Level 1-100 Growth Formula dengan tabel contoh
□ Star System ★ → ★★★★★ maksimal 5★ dengan 12 copy total
□ Rarity System Common→Rare→Epic→Legendary→Mythic dengan fungsi yang jelas
□ Duplicate Hero System: jadi star upgrade material atau XP
□ Skill System: 3 skill per hero (Skill 1, Skill 2, Ultimate)
□ Energy System 0-100 dengan generation rate TENTATIVE
□ Auto Battle AI sederhana per class
□ Damage Formula fisik dan magic sudah dibuat
□ Healing Formula sudah didefinisikan
□ Hero Power dibatalkan (Party Power dipakai alternatif)
□ Party Composition 3 kombinasi valid dengan analysis balance
□ Balance Analysis class vs class sudah lengkap
□ FINAL DECISIONS tercatat dengan bordered merk
□ PROPOSALs dan OPEN QUESTIONs tercatat untuk Phase 3

Selesai. Dokumen Phase 2 GRAM AFK HEROES HERO SYSTEM V1 selesai dibuat.
