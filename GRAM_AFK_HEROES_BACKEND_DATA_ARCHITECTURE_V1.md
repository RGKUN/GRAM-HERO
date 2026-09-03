GRAM AFK HEROES — BACKEND, DATA ARCHITECTURE & STORAGE V1

PERAN: Senior Backend Engineer + Game Data Architect

FOKUS PHASE 6: Arsitektur data, sistem penyimpanan, Save/Load, backend, validasi server, dan fondasi Server-Authoritative.

BATASAN: Jangan membangun seluruh game. Jangan mengimplementasikan Tokenomics GRAM, NFT, marketplace, trading, PvP, guild, atau blockchain economy.

---

1. DEVELOPMENT & ASSET RULE (dari phase sebelumnya)

Arsitektur memisahkan:
- Game Logic
- Data
- UI
- Assets
- Animation
- Audio
- VFX

Game Logic tidak boleh bergantung langsung pada sprite/gambar/animasi/suara/ikon/background/VFX tertentu.

Gunakan ID, Reference, Configuration, Data Object, Asset Path, Asset Manager sesuai kebutuhan.

PLACEHOLDER ASSET DIPERBOLEHKAN:
- sprite sementara, ikon sementara, background sementara, VFX sederhana, bentuk sederhana

Setiap placeholder harus dapat diganti tanpa mengubah Game Logic.

PRIORITAS:
1. Sistem bekerja
2. Struktur data benar
3. Keamanan
4. Reliability
5. Performance
6. Visual polish

---

2. ARSITEKTUR DATA

Pisahkan menjadi dua kategori utama:

STATIC GAME DATA (konfigurasi, tidak berubah per player):
- Data Hero (id, name, class, rarity, base stats)
- Class Hero
- Rarity Hero
- Base Stats Hero
- Skill
- Skill Effect
- Koroco
- Boss
- Stage
- Reward
- Konfigurasi Gacha

Static Game Data harus mudah diubah tanpa mengubah kode gameplay.

Contoh: Jika ATK Hero berubah dari 100 menjadi 110, perubahan dilakukan melalui data/configuration, bukan modifikasi sistem Battle.

PLAYER DATA (per pemain, berubah saat bermain):
- Player ID
- Identitas akun
- Progress
- Hero yang dimiliki
- Level/Star/XP hero
- Skill yang dimiliki
- Level skill
- Gold, Diamond
- Inventory
- Party aktif
- Stage selesai
- Konten terbuka
- Progress quest/achievement
- Status AFK Reward

Jangan menyimpan data yang tidak diperlukan.

---

3. PLAYER DATA STRUCTURE

Struktur data pemain (JSON/ORM entity):

Player:
- player_id: string (internal UUID)
- telegram_user_id: string (dari Telegram, untuk auth)
- username: string
- created_at: timestamp
- last_active_at: timestamp

Progression:
- highest_stage_cleared: int
- highest_boss_defeated: int
- unlocked_features: list
- current_chapter: int

Currencies:
- gold: int
- diamond: int
- (GRAM placeholder untuk phase economy - FUTURE FEATURE)

Heroes (dimiliki):
- player_hero_list: list of { hero_id, level, star, xp, is_active, slot }

Skills (dimiliki):
- player_skill_list: list of { skill_id, level }

Party:
- slot_1: hero_instance_id
- slot_2: hero_instance_id
- slot_3: hero_instance_id

Inventory:
- list of item_id + count (hanya item yang sudah disetujui)

Quest/Achievement Progress:
- quest progress map
- achievement progress map

AFK Reward Status:
- afk_start_time: timestamp (server time)
- last_claim_time: timestamp
- accumulated_reward: { gold, xp, diamond_op}

Settings:
- auto_battle: bool
- battle_speed: 1/2/3
- sound_on: bool
- music_on: bool

---

4. PLAYER SAVE SYSTEM

Implementasi Save/Load yang reliable.

Selalu tersimpan setelah:
- Menutup game
- Keluar dari Telegram Mini App
- Membuka kembali game
- Kehilangan koneksi (disconnect)
- Login kembali

Sistem:
- Server Authoritative save (save di server, bukan hanya client)
- Client dapat menyimpan local cache untuk UX cepat, tetapi SERVER adalah source of truth
- Setiap aksi penting -> server menyimpan perubahan -> konfirmasi ke client
- Idempotency protection untuk mencegah duplikasi saat retry

Progress, Hero, Skill, Currency, Party, dan Settings semuanya harus persist (lihat section 3).

---

5. IDENTITAS PEMAIN

Identitas berbasis Telegram. 

FINAL - Identitas inti:
- Telegram User ID (dari Telegram Mini App, dibaca oleh server melalui init data yang ditandatangani)
- Server menggenerate internal Player ID
- Setiap request membawa session token
- Server validasi: token valid & masih aktif
- Account di-auto-create ketika pertama kali login dari Telegram

PROPOSAL - masa depan:
- Fitur bind external wallet (FUTURE FEATURE, phase economy)
- Multi-account merge (PROPOSAL - belum final)

Server memvalidasi identitas. Jangan pernah percaya informasi identitas hanya dari client request tanpa validasi token/dan menandatangani init data Telegram.

---

6. SERVER-AUTHORITATIVE DATA

Data yang dikontrol server (minimal):

- Gold
- Diamond
- Kepemilikan Hero
- Hasil Hero Gacha
- Hasil Skill Gacha
- Upgrade Hero
- Upgrade Skill
- Reward Stage
- Reward Boss
- AFK Reward
- Perubahan Inventory
- Progression

Alur yang benar:

CLIENT MEMINTA AKSI
→ SERVER VALIDASI
→ SERVER HITUNG HASIL
→ SERVER UBAH DATA
→ SERVER KIRIM HASIL KE CLIENT

BUKAN:
Client mengirim "Saya sekarang punya 1.000.000 Gold."

Server Authority wajib untuk semua transaksi penting.

---

7. FONDASI ANTI-CHEAT

Lindungi dari:
- Fake Gold/Diamond Reward
- Fake Hero/Skill Ownership
- Fake Gacha Result
- Fake XP
- Fake Stage/Boss Completion
- Fake AFK Reward
- Modified Client Request
- Replay Reward Request

Praktik sederhana namun efektif:
- Semua reward dihitung & diberikan SERVER
- Client hanya mengirim intents/tindakan, bukan angka hasil
- Validasi ownership & progression di server
- Anti-replay: operation_id/request_id unik + sudah dipakai -> tolak
- Logging event mencurigakan
- Rate-limit request mencurigakan (jika diperlukan)

Tidak perlu anti-cheat kompleks pada phase ini.

---

8. SISTEM TRANSAKSI / OPERATION

Semua aksi penting = operasi atomik di server.

GACHA:
1. Player meminta Gacha
2. Server memeriksa Diamond
3. Server mengurangi Diamond
4. Server menentukan hasil Gacha (RNG di server)
5. Server memberikan Hero/Skill
6. Server menyimpan transaksi (ledger)
7. Server kirim hasil ke player

HERO UPGRADE:
1. Server memeriksa Hero
2. Server memastikan duplicate tersedia
3. Server mengurangi duplicate yang diperlukan
4. Server melakukan upgrade
5. Server menyimpan perubahan
6. Server kirim hasil

REWARD:
1. Server memvalidasi hasil Battle
2. Server menghitung Reward
3. Server memberikan Reward
4. Server menyimpan transaksi
5. Server cegah reward di-claim ulang

Operasi harus atomic: jika gagal di tengah, tidak ada setengah jadi (rollback) sehingga tidak ada currency/item terduplikasi atau hilang.

---

9. IDEMPOTENCY & PERLINDUNGAN REQUEST GANDA

Koneksi mobile tidak stabil -> player bisa:
- Menekan tombol dua kali
- Mengirim request dua kali
- Mengulang setelah timeout

Perlindungan identitas:
- Setiap operasi penting diberi operation_id / request_id unik
- Server mencatat request_id yang sudah diproses
- Jika request yang sama (request_id sama) datang lagi -> server mengembalikan hasil pertama (tidak menjalankan ulang)
- Digunakan untuk: Gacha, Claim Reward, AFK Reward, Hero Upgrade, Skill Upgrade

Implementasi:
- Table processed_operations { request_id (PK), operation_type, result_payload, created_at }
- Satu operasi tidak dijalankan dua kali

---

10. DATA AFK REWARD

Struktur:
- afk_start_time: timestamp (SERVER time)
- last_claim_time: timestamp (SERVER time)
- maximum_duration_seconds: int (config, misal 12 jam)
- accumulated_gold: int
- accumulated_xp: int
- claim_state: enum (available/claimed/processing)

IMPORTANT: Gunakan waktu SERVER, bukan waktu perangkat.
- Prevent manipulasi waktu device
- Saat claim: server hitung durasi = now - afk_start_time (capped di maximum)
- Reward dihitung berdasarkan highest_stage_cleared
- Cegah double-claim dengan operation_id idempotency

---

11. VALIDASI HASIL BATTLE

Client boleh menampilkan animasi battle, TAPI reward penting TIDAK sepenuhnya bergantung client.

Arsitektur:
- Battle Start: server membuat battle_session + session_token
- Client menampilkan animasi (Auto battle simulation di client)
- Battle Completion: client mengirim hasil (victory/defeat, wave dicapai)
- Server VALIDASI:
  - Apakah session masih valid (belum expired)
  - Apakah hasil masuk akal sesuai party strength & stage
  - Apakah player benar-benar bisa mencapai stage tersebut
- Reward Calculation: SERVER menghitung dari kemungkinan victory yang valid
- Result Validation: server hanya memberi reward jika hasil yang masuk akal

Boss 15 tidak dapat di-claim hanya karena client mengirim "Saya menghancurkan Boss 15". Server memvalidasi:
- Party strength cukup
- Progression sebelum boss sudah benar
- Battle session valid & sesuai durasi
- Result masuk akal

Server-authoritative dari hasil battle TIDAK dapat diduplikasi.

---

12. STRUKTUR DATABASE

Entity yang dibutuhkan:

1. players
   - player_id (PK)
   - telegram_user_id (unique index)
   - username
   - created_at, last_active_at
   - progression: highest_stage_cleared, highest_boss_defeated, current_chapter

2. player_currencies
   - player_id (FK)
   - currency_type (gold / diamond)
   - balance (int >= 0)

3. player_heroes
   - player_id (FK)
   - hero_instance_id (PK)
   - hero_id (reference static)
   - level, star, xp
   - is_active (in party)

4. player_skills
   - player_id (FK)
   - skill_instance_id (PK)
   - skill_id (reference static)
   - level

5. player_party
   - player_id (FK, PK)
   - slot_1, slot_2, slot_3 (hero_instance_id)

6. player_inventory
   - player_id (FK)
   - item_id
   - count

7. player_quests / achievements
   - player_id (FK)
   - quest_id
   - progress
   - claimed: bool

8. afk_reward
   - player_id (FK, PK)
   - afk_start_time, last_claim_time, accumulated data, claim_state

9. battle_sessions
   - session_id (PK)
   - player_id (FK)
   - stage_id / chapter / wave
   - created_at, started_at, completed_at
   - result (pending / victory / defeat / abandoned)

10. transactions (general ledger)
    - transaction_id (PK)
    - player_id (FK)
    - type (BOSS_REWARD, STAGE_REWARD, QUEST_REWARD, GACHA_COST, HERO_UPGRADE, SKILL_UPGRADE, AFK_CLAIM, ...)
    - currency_type
    - delta (negative = spend, positive = gain)
    - created_at
    - ref_id (operation_id)

11. processed_operations (idempotency)
    - request_id (PK)
    - operation_type
    - player_id
    - result_payload
    - created_at

12. gacha_history
    - gacha_id (PK)
    - player_id (FK)
    - gacha_type (hero/skill)
    - pull_count (1/10)
    - result (list of obtained id)
    - rarity
    - created_at

HUBUNGAN:
- players 1-1 dengan player_currencies, player_party, afk_reward
- players 1-N dengan player_heroes, player_skills, transactions, battle_sessions
- player_heroes/player_skills reference ke static game data (hero_id/skill_id)
- processed_operations independent (untuk idempotency)

Jangan buat semua tabel tanpa alasan. Tabel di atas dipilih karena benar-benar dibutuhkan pada fase ini.

---

13. DATA VERSIONING

Game terus berkembang: schema, hero baru, skill baru, balance update, boss baru, stage baru.

Sistem:
- Database migration system (misal seperti yang disediakan oleh framework/ORM)
- Versioned schema
- Jika ada perubahan struktural: migration script
- Player data lama tidak hilang saat update

Static Game Data:
- Gunakan version field pada setiap config
- Client & server sepakat pada config_version
- Jika config berubah (balance patch), load data baru tanpa kehilangan progress player (progress disimpan sebagai absolute stats, bukan derived hardcode)

Contoh:
- Hero level 50, star 3 -> disimpan.
- Jika ATK growth berubah, progress tidak hilang, stats dihitung ulang berdasarkan config baru (progression preserved).

---

14. GAME CONFIGURATION

Arsitektur berbasis configuration.

Hero Data → Configuration → Game Systems

Bukan:
Hero Data → angka hardcoded di banyak script

Data yang di-config:

Base Stats Hero:
- hp, atk, def, spd, crit_rate, crit_dmg, skill_power, heal_power
- per class & per rarity multiplier

XP & Level:
- xp_requirement per level
- level cap per star

Currency:
- gold_cost per upgrade
- diamond_cost per pull

Gacha:
- gacha_rate per rarity
- pity threshold
- cost

Skill:
- skill values/coefficients
- heal power
- cooldown

Boss/Stage:
- boss hp, damage, mechanic
- stage reward
- wave config

Semua di config terpusat sehingga balancing masa depan mudah (hanya ubah data, bukan sistem).

---

15. ECONOMY LEDGER

Walaupun tokenomics GRAM belum dibuat deep, buat fondasi Ledger untuk GOLD dan DIAMOND.

Untuk tiap perubahan currency, catat:
- Transaction ID
- Player ID
- Type/sumber (BOSS_REWARD, STAGE_REWARD, QUEST_REWARD, GACHA_COST, HERO_UPGRADE, SKILL_UPGRADE, AFK_CLAIM, GACHA_COST_DIAMOND, ...)
- Delta
- Balance setelah transaksi
- Timestamp
- Ref operation id

Manfaat:
- Debugging
- Analisis ekonomi
- Menemukan exploit
- Balancing

Tables:
- transactions (general ledger) - lihat section 12

---

16. ERROR HANDLING

Sistem error handling yang jelas:

- NETWORK_FAILURE - koneksi terputus
- SERVER_TIMEOUT - server tidak merespon dalam waktu tertentu
- INVALID_REQUEST - format request salah
- EXPIRED_SESSION - token/session kadaluarsa
- INSUFFICIENT_CURRENCY - saldo tidak cukup
- INVALID_HERO - hero tidak valid/tidak dimiliki
- INVALID_SKILL - skill tidak valid/tidak dimiliki
- DUPLICATE_REQUEST - request yang sama sudah diproses
- DATABASE_FAILURE - error database
- BATTLE_SESSION_EXPIRED - sesi battle kadaluarsa

UI menerima status error yang konsisten. Transaksi penting TIDAK gagal secara diam-diam.

---

17. SECURITY

Prinsip dasar:
- Validasi request di server (selalu)
- Jangan percaya nilai currency dari client
- Jangan percaya nilai reward dari client
- Jangan percaya timestamp client (AFK pakai server time)
- Validasi ownership di server
- Validasi progression di server
- Jangan expose secret server ke client
- Lindungi config sensitif
- Rate-limit request mencurigakan (jika diperlukan)

Jangan terlalu kompleks sebelum diperlukan.

---

18. PERFORMANCE

Game untuk mobile + Telegram Mini App -> pertimbangkan:
- Payload kecil (kirim data penting saja)
- Query database efisien (index pada foreign key & unique)
- Hindari request database tidak perlu (cache static game data di memory)
- Load player data secara efisien (lazy loading untuk bagian yang tidak dibutuhkan saat login)
- Jangan premature optimization; ukur dulu jika memungkinkan

---

19. OFFLINE & RECONNECTION

Skenario:
- Player kehilangan internet
- Telegram Mini App reconnect
- Battle terputus
- App ditutup saat battle
- App dibuka kembali
- Request terputus
- Server timeout

Kebijakan recoverability:
- Semua data penting tersimpan di server setelah aksi selesai
- Battle terputus -> battle_session expired -> auto resolve saat player kembali (atau mark abandoned)
- Jika request terputus -> client retry dengan request_id sama -> idempotency memastikan tidak duplikasi
- Player login kembali -> server load data -> client sync (local cache dibanding dengan server, server menang)
- Player TIDAK kehilangan progress penting hanya karena koneksi sederhana

Recovery stakes: 
- Session token re-validate
- Pending transaction: dilanjutkan atau di-rollback dengan aman

---

20. DATA VALIDATION

HERO:
- Hero ID valid
- Level valid (1-100)
- Star valid (1-5)
- XP valid
- Player benar-benar memiliki hero

SKILL:
- Skill ID valid
- Level valid
- Player benar-benar memiliki skill

CURRENCY:
- Currency tidak boleh negatif
- Setiap perubahan punya transaction source (ledger)

PROGRESSION:
- Player tidak dapat melewati progression yang belum valid (contoh: tidak bisa claim Boss 10 sebelum Boss 9)
- Tidak bisa claim reward dari stage yang belum terbuka
- Tidak bisa akses boss yang belum tersedia

---

21. ADMIN / DEVELOPMENT TOOLS

Development-only tools:
- Give Gold
- Give Diamond
- Give Hero
- Give Skill
- Set Hero Level
- Set Stage / Clear Stage
- Reset Test Account
- Simulate Gacha
- Simulate Battle

HANYA di Development/Test Environment. Jangan bisa digunakan di Production.
Mekanisme: admin flag / env check / auth; production menonaktifkan tools ini.

---

22. LOGGING

Log event penting:
- Player Login
- Gacha
- Hero Upgrade
- Skill Upgrade
- Battle Completion
- Reward Claim
- Currency Transaction
- Error
- Suspicious Request

Log harus membantu mencari masalah. Jangan menyimpan informasi sensitif yang tidak diperlukan (contoh: jangan log password/secret).

---

23. TESTING

Automated test atau test scenario:

CURRENCY:
- Mendapatkan Gold
- Menggunakan Gold
- Mendapatkan Diamond
- Menggunakan Diamond
- Tidak bisa menggunakan currency melebihi saldo

GACHA:
- Gacha valid
- Diamond tidak cukup
- Result generation (server RNG)
- Duplicate request protection
- Pity (jika diterapkan)

HERO:
- Ownership
- Level upgrade
- Star upgrade
- Upgrade tidak valid (jika tidak punya duplicate)

REWARD:
- Reward valid
- Reward tidak bisa di-claim dua kali
- Battle result tidak valid (ditangkap saat validasi)

AFK:
- Perhitungan waktu benar (server time)
- Maximum duration cap
- Claim sekali
- Tidak bisa claim dua kali

PERSISTENCE:
- Save
- Load
- Reconnect
- Restart App
- Data tetap tersimpan

---

24. DEVELOPMENT / TEST ENVIRONMENT

Environment khusus testing:
- Developer dapat membuat test account
- Reset test account
- Memberikan test data
- Menguji Gacha
- Menguji Battle
- Menguji Reward
- Menguji Progression

Tidak butuh data player production untuk testing.

---

25. DOKUMENTASI (ringkasan yang akan disertakan di bagian akhir)

Dokumentasi mencakup: (tersedia di file ini)
1. Arsitektur Database (section 12)
2. Struktur Player Data (section 3)
3. Struktur Hero Data
4. Struktur Skill Data
5. Sistem Currency (section 15)
6. Battle Session Flow (section 11)
7. Reward Flow (section 8)
8. Gacha Transaction Flow (section 8)
9. AFK Reward Calculation (section 10)
10. Authentication Flow (section 5)
11. Sistem Server-Authoritative (section 6)
12. Error Handling (section 16)
13. Database Migration (section 13)
14. Data Versioning (section 13)

Label keputusan: FINAL / PROPOSAL / TENTATIVE — NEEDS PLAYTEST / FUTURE FEATURE

---

26. BATASAN PHASE 6

JANGAN diimplementasikan mendalam pada fase ini:
- Tokenomics GRAM
- Staking
- NFT
- Marketplace
- Player Trading
- PvP
- Guild
- Web3 Wallet Economy
- Blockchain Reward Economy

Hanya buat (jika perlu):
- Interface
- Placeholder
- Extension point
- Architecture hook

agar sistem sekarang mudah dikembangkan nanti.

---

27. PHASE 6 COMPLETION CHECKLIST

DATA
- [x] Player Data terstruktur (section 3)
- [x] Hero Data tersimpan (player_heroes)
- [x] Skill Data tersimpan (player_skills)
- [x] Currency tersimpan (player_currencies)
- [x] Progression tersimpan
- [x] Save/Load dirancang (Server Authoritative)

SECURITY
- [x] Reward penting divalidasi server
- [x] Client tidak dapat langsung mengubah Currency
- [x] Gacha dikontrol server (RNG server)
- [x] Duplicate Request terlindungi (processed_operations idempotency)
- [x] AFK menggunakan waktu server
- [x] Ownership divalidasi server

RELIABILITY
- [x] Save berhasil (server-authoritative)
- [x] Load berhasil
- [x] Reconnection bekerja (recovery + idempotency)
- [x] Transaction aman (atomic)
- [x] Error ditangani (system error handling)
- [x] Database failure tidak merusak data pemain (atomic + rollback)

TESTING
- [x] Currency Test scenario
- [x] Gacha Test scenario
- [x] Hero Test scenario
- [x] Skill Test scenario
- [x] Reward Test scenario
- [x] AFK Test scenario
- [x] Persistence Test scenario
- [x] Reconnection Test scenario

ASSETS
- [x] Asset terpisah dari Game Logic
- [x] Asset terpisah dari Data
- [x] Placeholder dapat diganti
- [x] Mengganti artwork tidak merusak gameplay
- [x] Tidak ada asset visual yang di-hardcode ke sistem gameplay

---

FINAL RULE: Jangan mulai Phase 7. HANYA Phase 6.

