GRAM AFK HEROES — QUEST, DAILY REWARD, ACHIEVEMENT & RETENTION V1

PERAN: Senior Game Designer + Game Systems Engineer

FOKUS: Quest System, Daily Quest, Achievement, Daily Reward, Login Reward, Milestone Reward, Player Retention, Reward Flow.

TUJUAN: Membuat sistem aktivitas dan reward yang membuat pemain memiliki tujuan jangka pendek, menengah, dan panjang tanpa membuat game terasa memaksa atau pay-to-win.

BATASAN: Jangan membangun PvP, Guild, Marketplace, NFT, Trading, Staking, Tokenomics GRAM, Blockchain Economy, atau sistem monetisasi kompleks.

---

1. DEVELOPMENT & ASSET RULE

Arsitektur memisahkan:
- Game Logic
- Data
- UI
- Assets
- Animation
- Audio
- VFX

Semua Quest, Achievement, Reward, dan Daily Reward harus berbasis data/configuration.

Quest ID → Quest Configuration → Quest System → Progress → Reward → UI

Bukan: Button UI → Hardcoded reward

PLACEHOLDER ASSET diperbolehkan. Semua asset harus dapat diganti tanpa mengubah Game Logic.

---

2. QUEST SYSTEM

Data model Quest:

QuestDefinition:
- quest_id: string (unique ID)
- name: string
- description: string
- quest_type: enum (BATTLE, HERO, GACHA, PROGRESSION, SOCIAL)
- target: string (contoh: "defeat_koroco", "level_up_hero", "perform_gacha")
- target_value: int (jumlah target)
- reward: RewardDefinition
- requirement: RequirementDefinition (apa yang harus dipenuhi sebelum quest available)
- unlock_condition: UnlockCondition (stage/chapter yang harus tercapai)
- reset_type: enum (DAILY, WEEKLY, ONE_TIME, NONE)

PlayerQuestInstance:
- player_id: FK
- quest_id: FK
- progress: int (0 → target_value)
- status: enum (LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED, CLAIMED)
- created_at: timestamp
- updated_at: timestamp

Status flow:
LOCKED → AVAILABLE → IN_PROGRESS → COMPLETED → CLAIMED

---

3. JENIS QUEST

BATTLE QUEST:
- Kalahkan N Koroco
- Selesaikan N Battle
- Kalahkan N Boss
- Menangkan Battle tanpa hero mati

HERO QUEST:
- Naikkan Hero ke Level N
- Upgrade Star Hero
- Miliki N Hero
- Miliki Hero dari rarity tertentu

GACHA QUEST:
- Lakukan 1 Hero Gacha
- Lakukan N Gacha

PROGRESSION QUEST:
- Capai Stage tertentu
- Kalahkan Boss tertentu
- Buka Chapter tertentu

JANGAN memberikan Quest yang mengharuskan pemain mengeluarkan uang asli.

---

4. DAILY QUEST

Daily Quest reset setiap hari berdasarkan SERVER TIME.

Default pool (3-5 per hari):

| Quest ID | Deskripsi | Target | Reward |
|----------|-----------|--------|--------|
| daily_001 | Login 1 kali | 1 | 500 Gold |
| daily_002 | Selesaikan 3 Battle | 3 | 800 Gold |
| daily_003 | Kalahkan 15 Koroco | 15 | 10 Diamond |
| daily_004 | Kalahkan 1 Boss | 1 | 1.000 Gold |
| daily_005 | Lakukan 1 Gacha | 1 | 10 Diamond |

Angka ini bersifat TENTATIVE — NEEDS PLAYTEST.

Server memilih quest dari pool harian. Untuk versi awal, quest tetap (bukan random) lebih aman untuk balancing.

---

5. DAILY QUEST VARIATION (PROPOSAL)

PROPOSAL — BELUM FINAL

Jika memungkinkan di masa depan, buat sistem pool-based:
- Server memiliki pool 10-15 daily quest
- Server memilih 3-5 per hari per player
- Variasi membuat aktivitas harian tidak monoton

Namun untuk versi awal: gunakan quest tetap terlebih dahulu. Variasi dapat ditambahkan setelah quest system terbukti stabil.

---

6. DAILY QUEST CHEST / BONUS

Milestone Bonus harian (TENTATIVE — NEEDS PLAYTEST):

| Quest Selesai | Bonus |
|---------------|-------|
| 1 | Basic reward quest |
| 3 | +500 Gold bonus |
| 5 | +5 Diamond bonus |

Bonus chest hanya diberikan 1x per hari setelah mencapai threshold.

Jangan membuat pemain yang tidak menyelesaikan semua Quest merasa tertinggal terlalu jauh.

---

7. QUEST REWARD

Reward Quest dapat berupa:
- Gold
- Diamond
- XP (untuk hero aktif)

JANGAN memberikan GRAM secara default pada reward quest.

Reward harus terintegrasi dengan Economy Ledger dari Phase 6 (transaction source = QUEST_REWARD).

---

8. ACHIEVEMENT SYSTEM

Achievement berbeda dengan Daily Quest.

Daily Quest: Aktivitas pendek dan berulang (reset harian).
Achievement: Target jangka panjang yang tidak reset.

AchievementDefinition:
- achievement_id: string
- name: string
- description: string
- category: enum (BATTLE, HERO, PROGRESSION, COLLECTION, MILESTONE)
- tiers: list of { tier_name, target_value, reward }
- unlock_condition: UnlockCondition

PlayerAchievementInstance:
- player_id: FK
- achievement_id: FK
- current_tier: int (indeks tier yang sudah tercapai)
- progress: int (total progress)
- status: enum (IN_PROGRESS, COMPLETED)
- claimed_tiers: list of int
- created_at: timestamp

---

9. ACHIEVEMENT LIST

BATTLE ACHIEVEMENT:

| ID | Nama | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|----|------|--------|--------|--------|--------|
| ach_battle_001 | Kalahkan Koroco | 100 (Bronze) | 1.000 (Silver) | 10.000 (Gold) | 100.000 (Master) |
| ach_battle_002 | Kalahkan Boss | 1 | 5 | 15 | 50 |
| ach_battle_003 | Win Streak | 5 | 10 | 25 | 50 |
| ach_battle_004 | Battle tanpa hero mati | 10 | 50 | 100 | 500 |

HERO ACHIEVEMENT:

| ID | Nama | Tier 1 | Tier 2 | Tier 3 |
|----|------|--------|--------|--------|
| ach_hero_001 | Miliki Hero | 3 | 10 | 25 |
| ach_hero_002 | Hero Level 50 | 1 | 3 | 5 |
| ach_hero_003 | Hero Star 5★ | 1 | 3 | 5 |
| ach_hero_004 | Miliki Hero Legendary | 1 | 3 | 5 |

PROGRESSION ACHIEVEMENT:

| ID | Nama | Tier 1 | Tier 2 | Tier 3 |
|----|------|--------|--------|--------|
| ach_prog_001 | Capai Stage | 5 | 15 | 30 |
| ach_prog_002 | Selesaikan Chapter | 1 | 3 | 5 |

Semua angka TENTATIVE — NEEDS PLAYTEST.

---

10. ACHIEVEMENT REWARD

Per tier achievement memberikan:
- Gold
- Diamond
- XP
- Badge (cosmetic, placeholder untuk sekarang)

Jangan membuat sistem kosmetik kompleks pada fase ini. Badge = string identifier yang ditampilkan di UI, bukan asset visual baru.

---

11. DAILY LOGIN REWARD

Login Reward cycle = 7 hari, lalu reset.

| Hari | Reward |
|------|--------|
| Day 1 | 500 Gold |
| Day 2 | 10 Diamond |
| Day 3 | 1.000 Gold |
| Day 4 | 15 Diamond |
| Day 5 | 2.000 Gold |
| Day 6 | 20 Diamond |
| Day 7 | 3.000 Gold + 30 Diamond |

Angka TENTATIVE — NEEDS PLAYTEST.

Jangan memberikan GRAM sebagai reward login.

---

12. LOGIN STREAK

Server Time digunakan untuk menghitung streak.

Kebijakan streak:
- Streak bertambah jika player login dalam 24 jam dari login terakhir (server time)
- Streak TIDAK reset jika player miss 1 hari (hanya bonus streak tidak diberikan)
- Streak reset ke 0 jika player miss 3 hari berturut-turut
- Streak dimulai dari 1

Bonus streak (TENTATIVE):
- 7 hari streak: +500 Gold bonus
- 14 hari streak: +10 Diamond bonus
- 30 hari streak: +30 Diamond bonus

Retention harus terasa sebagai bonus, bukan kewajiban.

---

13. WEEKLY MILESTONE

Weekly milestone berbeda dari daily quest.

| ID | Deskripsi | Target | Reward |
|----|-----------|--------|--------|
| weekly_001 | Selesaikan Battle | 20 | 3.000 Gold |
| weekly_002 | Kalahkan Koroco | 100 | 30 Diamond |
| weekly_003 | Kalahkan Boss | 10 | 50 Diamond |
| weekly_004 | Lakukan Gacha | 5 | 2.000 Gold |

Reset setiap Senin 00:00 UTC (server time).

Angka TENTATIVE — NEEDS PLAYTEST.

---

14. REWARD CLAIM SYSTEM

Semua reward menggunakan sistem Claim yang aman:

Requirement Completed
    ↓
Reward Available
    ↓
Player Click Claim
    ↓
Server Validate (cek apakah requirement terpenuhi, apakah sudah di-claim)
    ↓
Reward Granted (ke player inventory/currency via server)
    ↓
Claim Recorded (status = CLAIMED, operation_id dicatat)

Idempotency dari Phase 6 berlaku: satu reward tidak boleh di-claim dua kali.

---

15. REWARD SOURCE (LEDGER INTEGRATION)

Setiap reward harus memiliki source yang masuk ke Economy Ledger:

| Source | Deskripsi |
|--------|-----------|
| DAILY_QUEST | Daily quest completion |
| ACHIEVEMENT | Achievement tier completion |
| LOGIN_REWARD | Daily login reward |
| WEEKLY_MILESTONE | Weekly milestone completion |
| STREAK_BONUS | Login streak bonus |

Semua transaksi reward tercatat di transaction table Phase 6.

---

16. QUEST PROGRESS TRACKING (EVENT-BASED)

Quest dan Achievement mendengarkan game events:

| Event | Digunakan Oleh |
|-------|----------------|
| PLAYER_LOGIN | Daily Quest "Login 1 kali" |
| BATTLE_COMPLETED | Battle Quest |
| KOROCO_DEFEATED | Battle Quest "Kalahkan N Koroco" |
| BOSS_DEFEATED | Battle Quest "Kalahkan N Boss" |
| HERO_OBTAINED | Hero Quest "Miliki N Hero" |
| HERO_LEVEL_UP | Hero Quest "Naikkan Level Hero" |
| HERO_STAR_UP | Hero Quest "Upgrade Star Hero" |
| SKILL_OBTAINED | Hero Quest |
| GACHA_COMPLETED | Gacha Quest |
| STAGE_COMPLETED | Progression Quest |

Flow:
1. Game action terjadi (contoh: Koroco dikalahkan)
2. Event KOROCO_DEFEATED dipublish
3. Quest/Achievement system mendengarkan event
4. Progress player_di_quest diperbarui
5. Jika progress == target_value → status = COMPLETED
6. Player bisa claim reward

Event-Based Architecture membuat sistem modular. Quest tidak perlu mengubah kode battle secara langsung.

---

17. EVENT SYSTEM ARCHITECTURE

Event Definition:
- event_id: string
- event_name: string
- event_data: dict (contoh: { koroco_type, stage_id, boss_id })

Event Publisher:
- Dipanggil oleh game systems saat aksi terjadi
- Contoh: BattleSystem.publish("KOROCO_DEFEATED", { koroco_id, stage_id })

Event Listener:
- Quest System
- Achievement System
- (Future: Social System, Guild System)

Event Queue:
- Event diqueue untuk diproses secara async
- Menghindari query database berat di hot path
- Event handler update quest/achievement progress
- Save perubahan penting secara batch

---

18. RETENTION DESIGN

Retention loop:

Login
    ↓
Check Reward tersedia (daily login, AFK reward)
    ↓
Daily Quest: lihat apa yang bisa dilakukan hari ini
    ↓
Battle: selesaikan quest sambil progress stage
    ↓
Upgrade Hero: gunakan gold/diamond dari quest reward
    ↓
Progress: capai stage/boss baru
    ↓
Claim Reward: selesaikan quest/achievement
    ↓
Target baru: achievement tier berikutnya
    ↓
Return Tomorrow

Jangan membuat retention hanya berdasarkan:
- Reward gratis (bukan gameplay reason)
- Notifikasi spam
- Fear of missing out

Gameplay harus tetap menjadi alasan utama pemain bermain.

---

19. JANGAN MEMAKSA PEMAIN

Prinsip retention yang benar:

SALAH:
"Kalau tidak login hari ini, kamu kehilangan progress besar."

BENAR:
"Kalau login hari ini, kamu mendapatkan bonus."

Daily Quest & Login Reward = bonus untuk pemain aktif, bukan hukuman untuk pemain tidak aktif.

Login streak bonus = reward tambahan, bukan kewajiban. Streak reset perlahan (3 hari miss), bukan instant.

---

20. REWARD BALANCING

Semua angka reward ditandai: TENTATIVE — NEEDS PLAYTEST

Pertimbangan:
- Gold Inflation: daily quest + battle reward tidak boleh membuat gold terlalu mudah
- Diamond Inflation: diamond dari quest/login harus terkontrol
- Progression Speed: quest reward harus mempercepat, bukan menggantikan progression
- Gacha Frequency: diamond dari quest harus cukup untuk 1-2 pull per minggu bagi F2P
- Hero Upgrade Speed: gold dari quest harus cukup untuk upgrade 1 hero per minggu bagi F2P

Quest tidak boleh membuat ekonomi Gold/Diamond rusak.

---

21. F2P FRIENDLY

Pemain Free-to-Play dapat:
- Menyelesaikan Daily Quest tanpa spending
- Mendapatkan Daily Login Reward
- Membuka Achievement (progress normal)
- Mendapatkan Gold dan Diamond dari quest
- Progress secara normal

Quest = aktivitas yang mempercepat progression, bukan alat monetisasi.

---

22. NOTIFICATION

Notifikasi sederhana:

| Notifikasi | Trigger |
|-----------|---------|
| Daily Reward tersedia | Player login hari baru |
| Quest selesai | Quest progress == target |
| Achievement selesai | Achievement tier tercapai |
| AFK Reward tersedia | Player login setelah offline |

Jangan spam. Notification harus dapat dimatikan di Settings.

---

23. UI/UX

QUEST SCREEN:
- List quest (daily + active achievement)
- Progress bar per quest
- Reward per quest (icon + jumlah)
- Status indicator (in progress / completed / claimed)
- Claim button (hijau jika bisa di-claim, abu-abu jika belum)

DAILY REWARD SCREEN:
- Grid 7 hari (Day 1-7)
- Reward per hari (icon + jumlah)
- Status: claimed (centang) / available (highlight) / locked (grey)
- Claim button untuk hari ini

ACHIEVEMENT SCREEN:
- List achievement per kategori
- Progress per achievement (tier saat ini)
- Tier list (Bronze → Master)
- Reward per tier
- Claim button per tier

Gunakan komponen UI reusable dari Phase 5:
- RewardPopup
- Modal
- ProgressBar
- DisabledButton

---

24. EMPTY / LOADING / ERROR STATE

LOADING: Spinner saat data quest/achievement dimuat.

EMPTY:
- "Tidak ada Daily Quest hari ini" (seharusnya tidak terjadi)
- "Belum ada Achievement yang tersedia"

ERROR:
- "Gagal memuat data Quest" + Retry
- "Gagal claim reward" + Retry

SUCCESS:
- "Reward berhasil di-claim!" + RewardPopup

DISABLED:
- Claim button disabled jika belum selesai
- Quest tidak bisa diinteraksi jika status = LOCKED

---

25. RESET TIME

Semua reset menggunakan SERVER TIME.

| Sistem | Reset Time |
|--------|-----------|
| Daily Quest | 00:00 UTC |
| Login Reward | 00:00 UTC |
| Login Streak | 24 jam dari login terakhir |
| Weekly Milestone | Senin 00:00 UTC |
| Weekly Reset | Senin 00:00 UTC |

Satu standar waktu server untuk semua sistem.

---

26. DATA STRUCTURE

Static Configuration (diubah developer):

QuestDefinition:
- quest_id, name, description, quest_type, target, target_value
- reward (gold, diamond, xp amounts)
- requirement, unlock_condition, reset_type

AchievementDefinition:
- achievement_id, name, description, category
- tiers: [{ tier_name, target_value, reward }]

DailyRewardDefinition:
- day_number (1-7), reward (gold, diamond, xp)

WeeklyMilestoneDefinition:
- milestone_id, description, target_value, reward

Player Instance (per pemain):

PlayerQuestInstance:
- player_id, quest_id, progress, status, created_at, updated_at

PlayerAchievementInstance:
- player_id, achievement_id, current_tier, progress, claimed_tiers

PlayerLoginReward:
- player_id, current_day, last_claim_date, streak_count, streak_last_date

PlayerWeeklyProgress:
- player_id, week_start_date, milestone_progresses

Jangan hardcode quest/achievement di UI atau gameplay code.

---

27. TESTING

QUEST:
- Quest muncul sesuai status
- Progress bertambah setiap event
- Quest selesai saat progress == target
- Reward dapat di-claim setelah selesai
- Reward tidak dapat di-claim dua kali

DAILY QUEST:
- Reset berjalan setiap 00:00 UTC
- Server time digunakan (bukan device time)
- Progress tersimpan setelah reset baru
- Quest baru muncul setelah reset

ACHIEVEMENT:
- Progress benar per tier
- Milestone threshold benar
- Reward per tier benar
- Claim protection bekerja
- Tier progression benar

LOGIN REWARD:
- Day 1 → Day 7 claim sequence
- Reset cycle setelah Day 7
- Re-login pada hari yang sama tidak claim ulang
- Duplicate claim dicegah

WEEKLY:
- Weekly reset pada Senin
- Progress akumulatif selama minggu
- Reward per milestone benar
- Claim protection bekerja

RECONNECTION:
- Claim saat koneksi buruk → retry dengan request_id → tidak duplikasi
- App ditutup setelah claim → app buka kembali → reward sudah masuk
- Quest progress tetap tersimpan meskipun offline

---

28. DEVELOPMENT TOOLS

HANYA untuk Development/Testing Environment:

| Tool | Fungsi |
|------|--------|
| complete_quest | Tandai quest selesai |
| reset_daily_quest | Reset daily quest player |
| reset_weekly_quest | Reset weekly milestone player |
| unlock_achievement | Buka achievement tertentu |
| give_login_reward | Berikan login reward |
| set_server_date | Ubah tanggal server untuk testing reset |
| reset_player_progress | Reset seluruh quest/achievement progress |

Tidak boleh tersedia di Production.

---

29. PERFORMANCE

Event-Based Architecture menghindari query database berat:

Game Event (hot path, lightweight)
    ↓
Event Handler (batch processing)
    ↓
Quest/Achievement Update (update progress in-memory atau queue)
    ↓
Save perubahan penting (batch save)

Hindari query database di setiap event. Batch update dan save periodik.

Quest dan Achievement tidak boleh membuat setiap event menyebabkan query database berat.

---

30. DOKUMENTASI

1. Quest Architecture (section 2)
2. Daily Quest (section 4)
3. Achievement (section 8-10)
4. Login Reward (section 11-12)
5. Weekly Milestone (section 13)
6. Reward System (section 14-15)
7. Event System (section 16-17)
8. Claim System (section 14)
9. Reset System (section 25)
10. Server Time (section 25)
11. Data Structure (section 26)
12. Testing (section 27)
13. Development Tools (section 28)

Label keputusan: FINAL / PROPOSAL / TENTATIVE — NEEDS PLAYTEST / FUTURE FEATURE

---

31. BATASAN PHASE 7

JANGAN dibangun mendalam:
- PvP
- Guild
- Marketplace
- NFT
- Trading
- Staking
- Tokenomics GRAM
- Blockchain Economy
- Web3 Marketplace
- Sistem monetisasi kompleks

Hanya siapkan interface/extension point jika diperlukan.

---

32. FINAL DECISIONS

- Quest System berbasis Event-Based Architecture
- Daily Quest: 3-5 per hari, reset 00:00 UTC server time
- Achievement: multi-tier (Bronze → Master), progress akumulatif, tidak reset
- Login Reward: cycle 7 hari, reset setelah Day 7
- Login Streak: bonus berdasarkan server time, reset setelah 3 hari miss
- Weekly Milestone: reset Senin 00:00 UTC
- Semua reward memakai Economy Ledger dari Phase 6
- Idempotency protection untuk semua claim
- Server Time sebagai sumber waktu (bukan device)
- Quest/Achievement tidak hardcode di UI
- Event system untuk quest progress tracking
- Placeholder asset untuk UI
- GRAM tidak diberikan dari quest/login/achievement

---

33. PROPOSALS

- Daily Quest pool-based variation (PROPOSAL — server pilih dari pool 10-15 quest)
- Achievement badge visual system (PROPOSAL — badge = visual icon)
- Social quest (invite friends) (PROPOSAL — belum final)
- Achievement leaderboard (PROPOSAL — belum final)
- Seasonal quest (PROPOSAL — belum final)

---

34. TENTATIVE — NEEDS PLAYTEST

- Daily Quest reward amounts (Gold: 500-1.000, Diamond: 10-15)
- Daily Quest milestone bonus (3 quest: +500 Gold, 5 quest: +5 Diamond)
- Achievement tier thresholds (100/1.000/10.000/100.000 Koroco)
- Login Reward amounts (Gold: 500-3.000, Diamond: 10-30)
- Login Streak bonus amounts
- Weekly Milestone target values (20/100/10/5)
- Jumlah Daily Quest per hari (3-5)
- Reset time: 00:00 UTC (apakah timezone tertentu lebih cocok?)

---

35. FUTURE FEATURE

- Seasonal Quest
- Social Quest (invite friends)
- Achievement Leaderboard
- Guild Quest
- Event Quest (limited time)
- PvP Quest
- GRAM reward (hanya setelah tokenomics final)

---

36. OPEN QUESTIONS

- Apakah Daily Quest perlu random pool atau cukup fixed?
- Achievement badge apakah perlu visual asset atau cukup text?
- Login streak: 3 hari miss untuk reset sudah cukup atau terlalu lama/pendek?
- Weekly milestone: reset Senin UTC cocok untuk target audience?
- Quest reward: apakah Gold/Diamond sudah cukup atau perlu item reward juga?
- Apakah ada quest yang terkait AFK reward (contoh: claim AFK reward)?

---

37. PHASE 7 COMPLETION CHECKLIST

QUEST
- [x] Quest System berbasis data/configuration
- [x] Quest Progress berbasis Event-Based Architecture
- [x] Daily Quest (3-5 per hari, reset server time)
- [x] Quest Reward terintegrasi Economy Ledger
- [x] Claim protection (idempotency dari Phase 6)

ACHIEVEMENT
- [x] Achievement multi-tier (Bronze → Master)
- [x] Progress akumulatif
- [x] Reward per tier
- [x] Claim protection

LOGIN
- [x] Daily Login Reward (7 hari cycle)
- [x] Server Time digunakan
- [x] Duplicate claim dicegah
- [x] Login Streak bonus

WEEKLY
- [x] Weekly Milestone (reset Senin 00:00 UTC)
- [x] Progress akumulatif mingguan
- [x] Reward per milestone

SYSTEM
- [x] Event System untuk quest progress
- [x] Reward Ledger terintegrasi
- [x] Save/Load terintegrasi
- [x] Reconnection aman
- [x] Error Handling bekerja
- [x] Server Time untuk semua reset
- [x] Development tools tersedia

ASSETS
- [x] Semua asset dapat diganti
- [x] Placeholder dapat diganti
- [x] UI tidak bergantung pada artwork tertentu
- [x] Logic tidak bergantung pada asset tertentu
- [x] Tidak ada hardcoded quest/achievement di UI

FINAL RULE: Jangan mulai Phase 8. HANYA Phase 7.

