GRAM AFK HEROES — POLISH, OPTIMIZATION, QA & RELEASE PREPARATION V1

PERAN: Lead Game Developer + QA Engineer + Game Systems Engineer + Performance Engineer + Release Engineer

TUJUAN: Memastikan seluruh sistem Phase 1–9 berjalan stabil dan terintegrasi dengan baik.

BATASAN: Jangan mengerjakan GRAM Tokenomics, NFT, Marketplace, PvP, Guild, DAO, Blockchain Economy, CEX, DEX.

---

1. TUJUAN UTAMA

Pastikan game sudah:
- Bisa dimainkan dari awal sampai akhir loop gameplay
- Tidak memiliki bug kritis
- Tidak memiliki soft-lock
- Tidak ada data hilang setelah reconnect/reload
- Battle stabil (auto + manual)
- Hero progression stabil
- Gacha stabil
- Quest/Achievement stabil
- Daily Reward stabil
- Equipment stabil
- Audio/VFX stabil
- UI tidak rusak di berbagai ukuran layar
- Performa mobile baik
- Data server aman
- Semua placeholder mudah diganti
- Sistem siap dikembangkan ke Web3 phase berikutnya

---

2. AUDIT SELURUH SISTEM

Core Game:
- Game initialization, loading, player creation
- Save/load, reconnect, session handling

Battle:
- Battle start, party formation, target selection
- Basic attack, skill, ultimate, energy
- Auto Battle, Manual Battle
- Wave, Koroco, Boss
- Victory, defeat, reward

Hero:
- Hero creation, level, stats, star, rarity
- Duplicate Hero, Hero Power, Skill

Economy:
- Gold, Diamond, reward, spending
- Gacha, AFK Reward

Quest:
- Daily Quest, Achievement, Daily Login, Weekly Milestone

Equipment:
- Inventory, equip, unequip, replace, upgrade
- Equipment stats, Hero stat recalculation

UI/UX:
- Navigation, popup, modal, loading, error
- Empty/success/disabled states

Audio/VFX:
- SFX, BGM, hit effect, damage number
- Skill/Ultimate/Heal/Critical/Death/Victory/Defeat
- Boss entrance

---

3. BUG CLASSIFICATION

| Severity | Deskripsi | Contoh |
|----------|-----------|--------|
| CRITICAL | Game crash, data hilang, infinite loop, exploit | Game crash, duplicate reward, currency exploit, battle tidak selesai |
| HIGH | Fitur utama tidak bekerja | Hero tidak bisa dipakai, stat salah, quest tidak claim, AFK reward salah |
| MEDIUM | UI error, animasi salah, minor calculation | Audio tidak muncul, alignment, minor visual |
| LOW | Cosmetic | Typography, color, spacing |

---

4. FULL GAMEPLAY TEST (Simulasi New Player)

| Langkah | Aksi | Validasi |
|---------|------|----------|
| 1 | Open game → Loading | Game load tanpa crash |
| 2 | Player creation | Player ID terbuat, data tersimpan |
| 3 | Pilih Starter Hero | Hero masuk inventory, stats benar |
| 4 | Home screen | Semua elemen tampil benar |
| 5 | Battle → Start | Battle dimulai, Koroco spawn |
| 6 | Melawan Koroco | Basic attack, damage number, HP turun |
| 7 | Melawan Boss | Boss spawn, mechanic jalan, HP bar tampil |
| 8 | Victory | Victory screen, reward tampil |
| 9 | XP + Gold | Hero XP naik, Gold bertambah |
| 10 | Upgrade Hero | Level naik, stat bertambah, gold berkurang |
| 11 | Gacha | Diamond berkurang, hero/skill didapat |
| 12 | Equip Equipment | Equipment terpasang, stat hero naik |
| 13 | Upgrade Equipment | Level equipment naik, stat naik |
| 14 | Quest selesai | Quest progress complete, reward bisa claim |
| 15 | Daily Reward | Login reward bisa di-claim |
| 16 | Achievement | Achievement terlihat, progress benar |
| 17 | AFK Reward | Reward terakumulasi, bisa claim |
| 18 | Reload game | Semua data tetap benar |
| 19 | Reconnect | Data sync, tidak ada yang hilang |

Setiap langkah harus divalidasi: visual + data/state.

---

5. BATTLE QA

Hero yang harus ditest: Swordman, Tank, Mage, Healer.
Mode: Manual dan Auto Battle.

| Skenario | Validasi |
|----------|----------|
| 1 Koroco | Spawn, attack, die, reward |
| Banyak Koroco | Semua spawn, AoE works, tidak lag |
| Boss | Entrance, mechanic, HP bar, death |
| Hero mati | Hero hilang dari battle, tidak crash |
| Semua Hero mati | Defeat screen muncul |
| Healer menyembuhkan | HP naik, heal number hijau |
| Tank defensive skill | DEF buff, taunt works |
| Mage AoE | Damage ke semua Koroco |
| Swordman single target | Fokus target |
| Ultimate aktif | Energy 100 → ultimate plays |
| Critical hit | CRIT number, SFX, VFX |
| Battle speed 2x/3x | Semua sinkron |

Yang TIDAK boleh terjadi:
- Infinite battle
- Infinite skill
- Negative HP
- Negative Energy
- Damage NaN
- Healing NaN
- Duplicate reward
- Reward tanpa victory
- Battle selesai dua kali

---

6. ECONOMY QA

Setiap transaksi currency harus punya:
- Source (sumber)
- Amount (+/-)
- Server timestamp
- Transaction ID
- Reason
- Validation

Validasi:
- Currency tidak negatif
- Reward tidak diberikan 2x
- Retry tidak menggandakan reward
- Gacha tidak bisa 2x dari double-click
- Disconnect saat transaksi tidak exploitable
- Reload tidak menggandakan reward

---

7. GACHA QA

| Test | Validasi |
|------|----------|
| Single Pull | 1 hero/skill didapat, diamond berkurang |
| 10 Pull | 10 hero/skill didapat, diamond berkurang 900 |
| Duplicate | Hero/skill duplikat ditangani dengan benar |
| Star conversion | Duplicate hero → star material |
| Rarity | Drop rate sesuai configuration |
| Pity | Setelah X pull tanpa Legendary → guaranteed |
| Server RNG | Random dari server, bukan client |

Pastikan UI drop rate sesuai konfigurasi server.

---

8. EQUIPMENT QA

| Test | Validasi |
|------|----------|
| Equip | Equipment terpasang, stat hero naik |
| Unequip | Equipment lepas, stat hero turun |
| Replace | Equipment lama ke inventory, baru terpasang |
| Upgrade | Level naik, stat naik, gold/material berkurang |
| Duplicate | Tersimpan di inventory |
| Class restriction | Hanya class yang sesuai bisa equip |
| Stat calculation | Final Stats = Base + Level + Star + Equipment |
| Max level | Tidak bisa upgrade melebihi max |

Satu centralized stat calculation system. Tidak ada dua sistem berbeda.

---

9. SAVE / LOAD / RECONNECT TEST

| Test | Validasi |
|------|----------|
| Reload browser | Semua data tetap |
| Close & reopen | Semua data tetap |
| Disconnect internet | Data tidak hilang |
| Reconnect | Data sync dengan benar |
| Background app | State terjaga |
| Telegram Mini App reopen | Resume dari state terakhir |
| Session expired | Re-login, data tetap |
| Multiple request | Idempotency works |

Data yang harus tetap:
- Hero, Level, Star, Skill
- Equipment, Gold, Diamond
- Quest progress, Achievement progress
- Daily reward state

---

10. ANTI-EXPLOIT QA

| Exploit | Pencegahan |
|---------|------------|
| Double click reward | Idempotency (request_id) |
| Double claim | Claim recorded, tidak bisa 2x |
| Replay request | Request ID already processed → reject |
| Request manipulation | Server authority, client data tidak dipercaya |
| Negative currency | Server validation, tidak bisa < 0 |
| Client reward modification | Server calculate reward, bukan client |
| Battle result manipulation | Server validate hasil battle |
| Gacha result manipulation | Server RNG |
| AFK time manipulation | Server time, bukan client time |
| Disconnect/reconnect exploit | Idempotency + session validation |

---

11. PERFORMANCE OPTIMIZATION

Test:
- FPS (target: 30 FPS minimum, 60 FPS ideal)
- Memory usage (tidak naik terus → memory leak)
- CPU usage
- Network request (batch, tidak berulang)
- Asset loading (cache, lazy load)
- UI rendering (tidak render element off-screen)
- Battle rendering (tidak lag saat banyak enemy)
- VFX pooling (tidak membuat object baru terus)
- Audio pooling (tidak overlap)
- Animation (sinkron dengan game state)

Hindari:
- Memory leak
- Object creation berlebihan
- Event listener tidak dibersihkan
- Network request berulang
- Update loop tidak diperlukan
- VFX berlebihan

Prioritas: Stability > Performance > Visual Polish

---

12. MOBILE RESPONSIVENESS

Game = Telegram Mini App portrait.

Test di:
- Small screen (iPhone SE, A1)
- Medium screen (Pixel, A52)
- Large screen (Tab, Phone besar)

Pastikan:
- UI tidak terpotong
- Button tidak keluar layar
- Text tidak overflow
- Modal tetap terlihat
- Battle UI nyaman
- Damage number di area yang benar
- Bottom navigation tidak tertutup
- Safe area diperhatikan
- Touch target cukup besar (44×44 dp minimum)

---

13. UI POLISH

Periksa:
- Alignment dan spacing konsisten
- Typography hierarchy jelas
- Button states: normal, pressed, disabled
- Loading state tampil
- Error state tampil
- Empty state informatif
- Modal konsisten
- Navigation jelas

Player harus selalu memahami:
- Apa yang sedang terjadi?
- Apa yang bisa saya lakukan?
- Apa reward saya?
- Apa yang harus saya lakukan berikutnya?

---

14. FEEDBACK POLISH

Setiap aksi penting memberikan feedback:

| Aksi | Feedback |
|------|----------|
| Button pressed | Visual + SFX |
| Basic Attack | Hit effect + damage number |
| Critical | Bigger VFX + CRIT text + SFX |
| Heal | Heal number + VFX hijau |
| Ultimate | Strong emphasis + big VFX |
| Skill | Cast + hit effect + SFX |
| Boss entrance | Dramatic + SFX |
| Boss death | Particles + screen feedback |
| Victory | Victory SFX + reward |
| Defeat | Defeat SFX + retry |
| Level Up | VFX + SFX + text |
| Gacha reveal | Rarity-based effect |
| Equipment upgrade | Upgrade feedback |

---

15. ASSET ARCHITECTURE CHECK

JANGAN hardcode asset visual ke gameplay logic.

Pertahankan:
- Game Logic ← tidak punya asset reference langsung
- Data/Configuration ← punya asset ID
- Asset Manager ← resolve ID → actual asset

Semua asset harus:
- Punya Asset ID/Reference
- Dapat diganti via configuration
- Placeholder tetap bisa diganti tanpa ubah logic

Contoh valid:
heroId → Hero Data → spriteId → Asset Manager → Hero Sprite

Contoh invalid:
Hero Logic → hardcoded image path

---

16. CODE QUALITY AUDIT

Periksa:
- Duplicate code → refactor jika perlu
- Dead code → hapus
- Unused variable → hapus
- Hardcoded values → pindah ke configuration
- Circular dependency → break dependency
- God object → split jika terlalu besar
- Excessive coupling → kurangi
- Missing error handling → tambahkan

JANGAN refactor besar yang tidak memberikan manfaat nyata. Refactor hanya untuk stabilitas.

---

17. CONFIGURATION SYSTEM CHECK

Pastikan angka penting TIDAK hardcoded di banyak tempat.

| Data | Harus di Configuration |
|------|----------------------|
| Hero base stats | ✅ |
| XP requirement | ✅ |
| Gold reward | ✅ |
| Diamond reward | ✅ |
| Gacha rate | ✅ |
| Pity threshold | ✅ |
| Equipment cost | ✅ |
| Upgrade cost | ✅ |
| Boss HP/damage | ✅ |
| Battle speed | ✅ |
| AFK reward formula | ✅ |
| Quest reward | ✅ |
| Achievement threshold | ✅ |
| Login reward | ✅ |

Balancing bisa dilakukan tanpa ubah gameplay logic.

---

18. BALANCING REVIEW

Review:

| System | Pertanyaan |
|--------|-----------|
| Hero progression | Terlalu cepat atau lambat? |
| Gold income | Cukup untuk upgrade? |
| Diamond income | Cukup untuk 1-2 pull/minggu (F2P)? |
| Gacha cost | Fair untuk F2P? |
| Equipment upgrade | Cost naik terlalu cepat? |
| XP progression | Level up terasa memuaskan? |
| Boss difficulty | Terlalu mudah/sulit? |
| AFK reward | Cukup membantu? |
| Quest reward | Worth it untuk daily play? |

Semua angka TENTATIVE — NEEDS PLAYTEST.

Jangan buff/nerf besar tanpa alasan. Buat rekomendasi jika ditemukan masalah.

---

19. PLAYER EXPERIENCE REVIEW

New Player harus memahami:
- Cara battle? → Ya/Tidak
- Cara mendapatkan Hero? → Ya/Tidak
- Cara upgrade Hero? → Ya/Tidak
- Cara menggunakan Skill? → Ya/Tidak
- Cara mendapatkan Gold? → Ya/Tidak
- Cara mendapatkan Diamond? → Ya/Tidak
- Cara menggunakan Equipment? → Ya/Tidak
- Cara claim reward? → Ya/Tidak

Returning Player harus memahami:
- Apa yang tersedia? → Quest/AFK reward
- Apa reward belum diambil? → Claim button visible
- Apa progress terbaru? → Stage/boss indicator
- Apa yang harus dilakukan? → Quest/achievement guidance

---

20. DEV / DEBUG TOOLS

Development/Test tools (TIDAK untuk production):

| Tool | Fungsi |
|------|--------|
| add_gold | Tambah gold |
| add_diamond | Tambah diamond |
| add_xp | Tambah XP ke hero |
| unlock_hero | Buka hero tertentu |
| set_hero_level | Set level hero |
| set_hero_star | Set star hero |
| give_equipment | Berikan equipment |
| complete_quest | Tandai quest selesai |
| reset_daily | Reset daily quest/reward |
| force_boss | Skip ke boss |
| force_victory | Auto win |
| force_defeat | Auto lose |
| clear_save | Hapus data player |
| reset_player | Reset seluruh progress |

HANYA development/test environment.

---

21. LOGGING

Event yang harus di-log:

- Login / Logout
- Battle Start / End (dengan result)
- Reward (dengan amount dan source)
- Gacha (dengan result)
- Currency Transaction (dengan delta)
- Equipment Upgrade
- Quest Claim
- Daily Reward Claim
- Error
- Validation failure
- Suspicious request

Log TIDAK membocorkan informasi sensitif.

---

22. AUTOMATED TEST

Unit Test:
- Damage calculation
- Healing calculation
- Energy generation
- XP requirement
- Level up
- Star upgrade
- Equipment stat
- Currency transaction

Integration Test:
- Battle → Reward flow
- Gacha → Hero added
- Equipment → Hero stat updated
- Quest → Reward claimed
- Daily Reward → Currency added

Regression Test:
- Setiap bug yang diperbaiki → test agar tidak terulang

---

23. RELEASE CHECKLIST

Gameplay:
- [ ] Battle playable (start → fight → victory/defeat)
- [ ] Koroco spawn & die correctly
- [ ] Boss spawn, mechanic, death works
- [ ] Victory screen + reward works
- [ ] Defeat screen + retry works
- [ ] Auto Battle works end-to-end
- [ ] Manual Skill works

Hero:
- [ ] Hero system stable (create, level, star, skill)
- [ ] Hero Power correct
- [ ] 4 class functions correctly
- [ ] Energy system works

Economy:
- [ ] Gold earn/spend correct
- [ ] Diamond earn/spend correct
- [ ] Gacha works (single, multi, pity, duplicate)
- [ ] AFK Reward works (server time, one claim)
- [ ] Economy Ledger记录正确

Equipment:
- [ ] Inventory works
- [ ] Equip/Unequip/Replace works
- [ ] Upgrade works (cost, level, stats)
- [ ] Class restriction enforced
- [ ] Stat calculation centralized

Quest:
- [ ] Daily Quest reset + progress + claim works
- [ ] Achievement progress + tier + claim works
- [ ] Daily Login Reward (7 days) works
- [ ] Weekly Milestone reset + progress works

UI:
- [ ] Mobile responsive (small/medium/large)
- [ ] Loading states work
- [ ] Error handling works
- [ ] Empty states work
- [ ] Modal/Popup consistent
- [ ] Navigation complete

Audio/VFX:
- [ ] SFX plays correctly
- [ ] BGM transitions smooth
- [ ] VFX pool working
- [ ] Damage numbers correct
- [ ] Performance acceptable

Backend:
- [ ] Save/load stable
- [ ] Reconnect stable
- [ ] Server validation stable
- [ ] Idempotency working
- [ ] No data loss

Security:
- [ ] Reward validation server-side
- [ ] Currency cannot go negative
- [ ] Gacha RNG server-side
- [ ] Battle result validated
- [ ] AFK time from server

Assets:
- [ ] All assets replaceable via reference
- [ ] No visual asset hardcoded to logic
- [ ] Placeholder → final swap ready

---

24. QA REPORT TEMPLATE

A. Bugs Found:
| Bug | Severity | System | Status |
|-----|----------|--------|--------|

B. Performance Issues:
| Issue | Impact | Recommendation | Status |
|-------|--------|----------------|--------|

C. Balancing Issues:
| System | Problem | Recommendation | Status |
|--------|---------|----------------|--------|

D. Release Blockers:
| Issue | Severity | Status |
|-------|----------|--------|

---

25. STRICT SCOPE

Phase 10 TIDAK mengerjakan:
- GRAM Tokenomics
- Token distribution / staking / farming
- NFT
- Marketplace
- Player trading
- PvP
- Guild
- DAO
- Blockchain economy
- CEX / DEX

---

26. DEVELOPMENT PRIORITY

1. Game tidak crash
2. Data aman
3. Gameplay bekerja
4. Economy tidak exploitable
5. UI/UX nyaman
6. Performance baik
7. Visual polish

Jangan korbankan stabilitas untuk visual.

---

27. FINAL REQUIREMENTS

Sebelum Phase 10 selesai:
1. Audit seluruh sistem Phase 1–9
2. Temukan bug → klasifikasi severity
3. Perbaiki semua Critical dan High bugs
4. Test ulang semua yang diperbaiki
5. Optimalkan performance
6. Review balancing
7. Test mobile responsiveness
8. Test save/load/reconnect
9. Test economy dan anti-exploit
10. Pastikan asset architecture modular
11. Pastikan placeholder bisa diganti tanpa ubah logic
12. Buat QA report (bugs, performance, balancing, blockers)
13. Buat daftar masalah yang butuh playtest

JANGAN klaim "production ready" jika masih ada Critical issue.

---

28. FINAL DECISIONS

- Bug classification: CRITICAL > HIGH > MEDIUM > LOW
- Full gameplay test = 19 langkah simulasi new player
- Battle QA: 14 skenario, 12 kondisi yang tidak boleh terjadi
- Economy QA: semua transaksi punya source/amount/timestamp/ID
- Gacha QA: server RNG, idempotency, pity validated
- Equipment QA: centralized stat calculation
- Save/Load: semua data persist, idempotency
- Anti-exploit: 11 jenis exploit yang diuji
- Performance: FPS target 30 min, 60 ideal
- Mobile: 3 screen sizes tested
- Configuration: semua angka penting di centralized config
- Dev tools: hanya di development/test
- Logging: semua event penting
- Automated test: unit, integration, regression
- Prioritas: Stability > Performance > Visual Polish
- JANGAN klaim production ready jika Critical issue masih ada

---

29. PROPOSAL

- Automated test coverage target (80%? 90%?)
- Performance benchmark target (FPS, memory, load time)
- Beta testing program (invite player test)
- Crash reporting system
- Analytics integration
- Remote configuration (ubah balance tanpa deploy)

---

30. TENTATIVE — NEEDS PLAYTEST

- FPS target (30 atau 60?)
- Memory limit
- Hero progression speed
- Gold/Diamond income balance
- Gacha drop rates
- Equipment upgrade costs
- Boss difficulty curve
- AFK reward formula
- Quest reward amounts
- Daily/Weekly reset time

---

31. FUTURE FEATURE

- Beta testing program
- Crash reporting
- Analytics
- Remote configuration
- Server-side feature flags
- A/B testing framework
- Performance monitoring dashboard

---

32. PHASE 10 COMPLETION CHECKLIST

FULL TEST
- [ ] Simulasi new player 19 langkah → semua valid
- [ ] Battle QA 14 skenario → semua pass
- [ ] Economy QA → semua transaksi valid
- [ ] Gacha QA → server RNG, idempotency, pity
- [ ] Equipment QA → stat calculation centralized
- [ ] Save/Load → semua data persist
- [ ] Reconnect → data sync benar
- [ ] Anti-exploit → 11 jenis exploit diuji

BUG
- [ ] Semua CRITICAL bugs diperbaiki
- [ ] Semua HIGH bugs diperbaiki
- [ ] MEDIUM bugs documented
- [ ] LOW bugs documented

PERFORMANCE
- [ ] FPS acceptable (30+ minimum)
- [ ] Memory tidak leak
- [ ] VFX pooling working
- [ ] Audio pooling working
- [ ] Battle smooth di mobile

MOBILE
- [ ] Small screen: UI OK
- [ ] Medium screen: UI OK
- [ ] Large screen: UI OK
- [ ] Touch targets cukup besar

UI POLISH
- [ ] Alignment & spacing OK
- [ ] Typography clear
- [ ] Button states correct
- [ ] Loading/Error/Empty/Success states OK
- [ ] Navigation complete

ASSET
- [ ] All assets via reference (replaceable)
- [ ] No asset hardcoded to logic
- [ ] Placeholder → final swap ready

CONFIG
- [ ] All balance numbers in centralized config
- [ ] No hardcoded values in gameplay logic

QA REPORT
- [ ] Bug report created
- [ ] Performance report created
- [ ] Balancing report created
- [ ] Release blockers documented

FINAL RULE: Jangan mulai Phase 11. HANYA Phase 10.

