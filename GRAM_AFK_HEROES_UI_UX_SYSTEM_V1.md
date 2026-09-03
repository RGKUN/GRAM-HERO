GRAM AFK HEROES — UI/UX SYSTEM V1

1. UI PHILOSOPHY
GRAM AFK HEROES adalah Pixel RPG mobile/Telegram Mini App bergenre PvE-focused dengan sistem AFK/Auto Battle. UI harus antusias untuk dipahami, mobile-friendly, dan konsisten. Prioritas: Usability > Visual Polish > Performance.

Principle UI:
- Simple dan cepat dipahami
- Mobile-friendly (portrait)
- Tidak terlalu penuh
- Cocok digunakan satu tangan
- Konsisten antar halaman
- Mudah dinavigasi tanpa tutorial panjang

«Prioritaskan usability daripada dekorasi.»

2. SCREEN ARCHITECTURE

Struktur layar utama yang dievaluasi:

HOME
- Player information
- Player level (jika digunakan)
- Currency (Gold, Diamond, GRAM status)
- Hero/party (3 hero aktif)
- Current progression (chapter/boss)
- Tombol Battle
- Navigation ke: Battle, Hero, Gacha, Quest, Settings

BATTLE
- Hero party (3 hero)
- Koroco/boss
- HP bar
- Energy
- Skill buttons
- Ultimate
- Auto Battle toggle
- Battle speed (jika ada)
- Wave information
- Boss information
- Reward/result area

HERO
- Hero collection grid/list
- Hero portrait/sprite
- Class indicator
- Rarity badge
- Star level
- Level
- Stats
- Skill overview
- Upgrade buttons

HERO DETAIL
- Name, Class, Rarity, Star, Level
- Semua stat: HP, ATK, DEF, SPD, CRIT Rate, CRIT DMG, Skill Power, Heal Power, Energy
- Skills (daftar)
- Upgrade options (Star, Level, Skill)

GACHA
- Hero Gacha section
- Skill Gacha section
- Cost per pull (Diamond)
- 1x / 10x pull buttons
- Current Diamond amount
- Rarity information (daftar kemungkinan)
- Pity/progress bar jika digunakan
- History pull (optional)

INVENTORY / COLLECTION
- Hero collection (grid/filter)
- Skill collection (jika ada)
- Item/material (jika disetujui Phase 4)
- Filter: Class, Rarity, Star, Level
- Sort: Level, Rarity, Class
- Search (jika hero banyak)

QUEST / REWARD
- Daftar quest harian
- Progress (0% → 100%)
- Reward yang bisa didapat
- Claim button (jika belum didapat)

SETTINGS
- Sound ON/OFF
- Music ON/OFF
- Language (jika multi-bahasa)
- Account/connection info
- Basic settings minimal

3. NAVIGATION

Struktur navigasi utama:

HOME
├── BATTLE (primary)
├── HERO (primary)
├── GACHA (primary)
├── QUEST (secondary)
└── SETTINGS (secondary)

Navigasi sifat:
- Horizontal bottom tabs (mobile-friendly)
- Maximum 5 tab utama
- Setiap tab langsung ke screen utama
- Submenu minimal (hanya Hero Detail, Gacha Result, dst.)

Jalur navigasi utama:
- Dari HOME bisa menuju: BATTLE, HERO, GACHA, QUEST, SETTINGS
- Dari BATTLE bisa: Victory/Defeat → REWARD → HOME
- Dari HERO bisa: Detail → Upgrade → HOME
- Dari GACHA: Result → Hero Added → HOME

Navigasi harus cepat, tidak ada screen yang memakan waktu load yang lama, dan back button selalu werk ke screen sebelumnya.

4. HOME SCREEN

Home adalah pusat game.

Prioritas informasi (dari atas):
1. Current progression (Chapter, Boss terkini)
2. Tombol Battle (primary CTA)
3. Active party (3 hero dengan portrait kecil + class icon)
4. Currency (Gold, Diamond count)
5. Notifikasi/reward penting (jika ada yang ready: upgrade, gacha, claim)

Desain:
- Layout bersih, tidak banyak dekorasi
- Gunakan card/component untuk menampilkan info
- Gunakan warna yang konsisten per class
- Tombol Battle harus terlihat (primary action)
- Information hierarchy jelas (heading → subheading → detail)

5. BATTLE UI

Battle UI hierarchy:

TOP:
- Stage/Chapter name (contoh: "Chapter 1: The Mines")
- Wave number (contoh: "Wave 3/10")
- Boss information (icon + HP bar minimal)

MIDDLE:
- Battle arena (field Koroco/boss)
- Hero party (3 hero di posisi FRONT/BACK)
- Enemy (Koroco/boss sprite)

BOTTOM:
- Skill 1 (active skill, cooldown visual)
- Skill 2 (active skill, cooldown visual)
- Ultimate (energy count 0-100 + button)
- Auto Battle toggle (ON/OFF)
- Battle speed (1×/2×/3× jika ada)

Pastikan:
- UI tidak menutupi character atau enemy
- Skill button terlihat aktif/cooldown sesuai status
- Energy count jelas di Ultimate button
- Auto Battle toggle terlihat statusnya

6. HERO UI

Hero collection harus mudah digunakan saat jumlah hero bertambah.

Pertimbangkan:
- Grid view dengan hero portrait + class badge + rarity + star + level
- Filter: Class (Swordman, Tank, Mage, Healer), Rarity (Common → Mythic), Star (★1-★5), Level
- Sort: Level (naik/turun), Rarity (naik/turun), Class
- Search field (opsional, kalau hero > 20)

Arkitektur:
- Harus memungkinkan jumlah hero bertambah tanpa UI perlu di-rework
- Setiap hero card memiliki ID, Class, Rarity, Star, Level yang terstruktur
- Tombol "Upgrade" visible jika material tersedia
- Tombol "Detail" membuka Hero Detail screen

7. GACHA UI

Gacha harus transparan dengan informasi:

- Cost per pull (Diamond): 1 pull = 100D, 10 pull = 900D
- Available rarity: Common (50%), Rare (30%), Epic (15%), Legendary (4,5%), Mythic (0,5%)
- Drop rate info terlihat (atau link ke detail)
- Pity progress (contoh: "0/10 sampai Legendary")
- Pull 1x dan Pull 10x button
- Current Diamond amount (di header atau bottom)
- History terakhir (3 pull terakhir untuk transparansi)

Jangan:
- Menyembunyikan peluang rarity
- Membuat cost tidak jelas
- Tombol aktif saat diamon tidak cukup

8. HERO DETAIL

Informasi yang perlu ditampilkan (minimal):

- Name
- Class icon
- Rarity badge
- Star level (★1-★5)
- Level (1-100)
- HP, ATK, DEF, SPD
- CRIT Rate, CRIT DMG
- Skill Power, Heal Power
- Energy (0-100)
- Skills (daftar Skill 1, Skill 2, Ultimate dengan description)
- Tombol: Upgrade (Star/Level), Kembali

Jangan menampilkan:
- Semua angka detail bawaan engine (kecuali jika butuh untuk balancing advanced)
- Informasi yang tidak player pahami

8. GACHA SCREEN

Screen gacha memiliki komponen:
- Header: "Gacha Hero" / "Gacha Skill" + current diamond
- Rarity odds section (transparent)
- Pull buttons: 1x (100D), 10x (900D) - disabled jika tidak cukup diamond
- Recent history (3 pull terakhir)
- Result area (setelah pull)

9. REWARD POPUP

Reusable reward component yang dapat digunakan untuk:

- Battle reward (setelah koroco/boss)
- Quest reward
- Achievement reward
- Gacha reward
- Event reward masa depan

Contoh struktur:
```
REWARD
+ 1,250 Gold
+ 30 XP
+ 2 Diamond
```

Component harus reusable di seluruh screen. Jika angka reward berubah, UI harus otomatis update dari data source, bukan hardcode.

10. MODAL / POPUP SYSTEM

Sistem reusable untuk:

- Confirmation: "Yakin upgrade star?" [Confirm] [Cancel]
- Reward: Popup reward setelah battle
- Gacha result: "Kamu dapat Hero Legendaris!" + hero card animation
- Level up: "Hero naik level 25 → 26!" + stat increase
- Star upgrade: "Meningkat ke ★3!" + stat changes
- Error: "Gagal menyimpan!" + Retry
- Information: "Maintenance pada jam XX" + OK

Semua modal/popup harus memiliki:
- Title
- Content
- Action button(s) (minimal 1)
- Close button (X) atau dismiss area
- Konsisten desain antar modal

11. UI STATE

UI harus menangani state berikut:

LOADING:
- Tampilkan spinner atau "Loading..."
- Non-aktifkan tombol selama loading
- Maximum 3 detik sebelum menunjukkan error jika gagal

EMPTY:
- Contoh: "Belum memiliki Hero ditambahan"
- Tombol "Gacha" disabled atau tetap aktif tapi info empty
- Text: "Dapat Hero pertama di Gacha!"

ERROR:
- "Data gagal dimuat"
- Tombol "Retry"
- "Connection error" + Retry

SUCCESS:
- "Upgrade berhasil!"
- "Hero naik level!"
- "Gacha berhasil!" + animasi

DISABLED:
- Button tidak dapat ditekan ketika kondisi belum terpenuhi
- Contoh: Tombol "Upgrade" disabled jika tidak cukup gold/material
- Jangan biarkan button terlihat aktif ketika sebenarnya tidak bisa digunakan

12. RESPONSIVE PORTRAIT UI

UI harus dirancang untuk portrait mobile.

Pertimbangkan:
- Small screen (seperti SE/A1)
- Medium screen (seperti A52/Pixel)
- Large screen (seperti Tab/Phone besar)
- Safe area (notch/cutout)
- Touch target: button minimal 44×44 dp
- Text readability: font size minimal 12px untuk body, 16px untuk heading

Button harus cukup besar untuk disentuh dengan jari.

Jangan mengandalkan hover interaction (target mobile).

13. ASSET ARCHITECTURE — WAJIB

Semua aturan asset dari phase sebelumnya tetap berlaku.

ASSET HARUS MUDAH DIGANTI.

Pisahkan:
- UI logic
- UI layout
- UI assets (icons, backgrounds, sprites)
- Hero sprite
- Koroco sprite
- Boss sprite
- Skill icon
- VFX

Jangan hardcode asset ke gameplay logic.

Setiap UI component mengambil asset melalui reference/path/configuration, bukan direkt path hardcode.

14. PLACEHOLDER ASSET DIPERBOLEHKAN

Jika artwork final belum tersedia:

BOLEH menggunakan:
- Placeholder sprite (kotak berwarna dengan icon)
- Placeholder icon (basic shape)
- Basic shape untuk background
- Temporary button
- Temporary VFX

Tujuan: "Semua screen dan interaction harus WORK terlebih dahulu."

Jangan menunggu artwork final untuk testing UI.

15. DATA DAN UI HARUS TERPISAH

UI hanya menampilkan data dari system.

Jangan menaruh:
- Stat Hero secara hardcode
- Gacha rate di banyak tempat
- Harga di UI tanpa data source
- Skill damage description di UI logic

Gunakan data/configuration yang terpusat (seperti yang dibuat di Phase 4).

Jika angka berubah (misal: gacha rate diubah dari 4,5% menjadi 5%), UI harus otomatis menggunakan angka baru dari data source.

16. COMPONENT ARCHITECTURE

Struktur folder UI/modular:

UI/
    Home/
        HomeScreen.vue (atau component serupa)
        HomeHeader.vue
        HomeProgressionCard.vue
        HomeHeroCard.vue
        HomeCTAButton.vue
    
    Battle/
        BattleScreen.vue
        BattleTopBar.vue
        BattleArena.vue
        BottomBar.vue
        SkillButton.vue
        UltimateButton.vue
        AutoToggle.vue
    
    Hero/
        HeroScreen.vue
        HeroGrid.vue
        HeroFilter.vue
        HeroSort.vue
        HeroCard.vue
        HeroDetail.vue
    
    Gacha/
        GachaScreen.vue
        GachaHeader.vue
        OddsInfo.vue
        PullButtons.vue
        ResultPopup.vue
    
    Components/
        RewardPopup.vue
        Modal.vue
        LoadingSpinner.vue
        EmptyState.vue
        ErrorState.vue
        DisabledButton.vue

Prinsip: Setiap screen dibangun dari komponen kecil yang reusable. Jika butuh ubah desain tombol, hanya perlu edit komponen Button, bukan seluruh screen.

17. NEW PLAYER FLOW

Flow pemain baru:

OPEN MINI APP
↓
LOADING (2-3 detik)
↓
START / ONBOARDING (pilih class, singkat)
↓
CHOOSE STARTER HERO (4 class, pilih 1)
↓
HOME screen tampil
↓
Tutorial singkat (2-3 menit): cara battle, koroco, skill, auto, reward
↓
FIRST BATTLE (otomatis atau manual basic)
↓
REWARD popup (Gold + XP)
↓
Bisa melanjutkan battle selanjutnya

Pastikan tidak ada screen yang membuat pemain bingung harus melakukan apa.

18. FIRST-TIME PLAYER EXPERIENCE

Tutorial singkat (jika diperlukan) yang menjelaskan:

1. Cara memulai Battle (tombol di bawah)
2. Koroco akan muncul secara otomatis
3. Basic attack sudah berjalan otomatis
4. Skill bisa dipakai manual (tombol skill)
5. Ultimate saat energy penuh
6. Auto Battle ON/OFF
7. Reward setelah victory (Gold + XP)
8. Kembali ke Home

Tutorial harus:
- Singkat (maksimal 5 menit)
- Bisa di-skip pemain yang sudah paham
- Tidak muncul lagi setelah 1x (atau bisa di-toggle di Settings)
- Gunakan placeholder asset jika artwork belum ada

19. ERROR & CONNECTION STATE

Karena game Telegram Mini App + backend:

- Loading state: spinner, non-aktifkan tombol
- Connection error: "Koneksi gagal" + Tombol Retry
- Transaction/action pending: "Sedang diproses..." + Batal jika perlu
- Server error: "Server error" + Log out / Retry
- Jangan membuat pemain mengira game berhenti ketika request sedang diproses

20. PERFORMANCE

UI harus ringan.

Hindari:
- Asset terlalu besar di UI screen
- Animasi berlebihan di setiap tombol
- Banyak efek simultan di screen sama-sama
- Rendering yang tidak diperlukan (contoh: render hero detail saat di home saja)

Battle harus tetap berjalan lancar di perangkat mobile kelas menengah.

21. IMPLEMENTATION RULE

Jika punya akses merubah source code:

Jangan langsung membuat seluruh UI dengan satu file besar.

Pisahkan komponen berdasarkan fungsi.

Contoh struktur (lihat section 16).

Struktur aktual boleh berbeda sesuai framework (React, Vue, Flutter, dll), tetapi prinsip modular harus dipertahankan.

Setiap komponen memiliki:
- Prop/Input yang jelas
- State internal
- Event output
- Desain konsisten

22. TESTING

Sebelum menyatakan Phase 5 selesai, test:

Navigation:
- Home → Battle
- Home → Hero
- Home → Gacha
- Home → Quest
- Home → Settings
- Back navigation dari setiap screen

Battle:
- Start battle
- Battle berjalan (auto/manual)
- Victory screen
- Defeat screen
- Reward popup

Hero:
- Open collection
- Filter/sort kerja
- Open detail
- Upgrade tombol working
- Level up

Gacha:
- Open Gacha
- Pull 1x dan 10x
- Result muncul
- Diamond dikurangi sesuai
- Hero ditambahkan ke collection

UI State:
- Loading state test
- Empty state test
- Error state test
- Disabled button test

Semua harus WORK menggunakan placeholder asset jika asset final belum tersedia.

23. FINAL DECISIONS

- 5 screen utama: Home, Battle, Hero, Gacha, Settings
- Navigation bottom tabs: 5 item maksimal
- Hero collection: grid view + filter + sort
- Battle UI: top-bar + arena + bottom bar
- Reward component: reusable di seluruh screen
- Modal/popup: sistem reusable dengan desain konsisten
- UI state: Loading, Empty, Error, Success, Disabled - semua termal
- Responsive: portrait mobile-first
- Asset: semua referensi melalui configuration, bukan hardcode
- Data & UI terpisah: UI ambil dari data source terpusat
- New player flow: onboarding + tutorial + first battle + reward

24. PROPOSALS (untuk diskusi masa depan)

- Proposal: Tambahan filter "Favorite" di Hero collection (PROPOSAL - BELUM FINAL)
- Proposal: Night mode UI (PROPOSAL - BELUM FINAL)
- Proposal: Skill preview hover di Hero Detail (PROPOSAL - BELUM FINAL)
- Proposal: Battle speed 0.5× (PROPOSAL - BELUM FINAL)
- Proposal: Multiple portrait orientation (PROPOSAL - BELUM FINAL)

25. TENTATIVE / NEEDS PLAYTEST

- Energy count di Ultimate button: apakah cukup besar untuk dibaca?
- Filter jumlah hero > 30: butuh search field atau cukup filter + sort?
- Modal posisi: center bottom atau center overlay?
- Battle speed: butuh fitur ini untuk AFK gameplay?
- Gacha odds: tampil langsung di screen atau di submenu?

26. OPEN QUESTIONS

- Player level ada tidak di Home screen? (Konflik dengan Phase 2 decision)
- Quest screen dibuat tidak (belum final di Phase 4)?
- Battle speed fitur final atau hanya placeholder?
- Berapa banyak history pull yang ditampung di Gacha screen?
- Sound effect di setiap tombol harus ada tidak?
- Settings berisi informasi account tambahan apa?

27. PHASE 5 COMPLETION CHECKLIST

□ UI Philosophy terdefinisi dan disepakati
□ Screen Architecture: Home, Battle, Hero, Gacha, Settings,dll terdefinisi
□ Navigation structure: bottom tabs 5 item, jalur navigasi jelas
□ Home Screen: progression, battle CTA, currency, party tampil
□ Battle UI: hierarchy TOP-MIDDLE-BOTTOM, semua element working
□ Hero UI: grid + filter + sort + detail screen
□ Gacha UI: transparent odds, cost, pity, pull buttons
□ Reward Component: reusable, bisa digunakan battle/quest/gacha
□ Modal/Popup System: reusable, title+content+action buttons
□ UI State: Loading, Empty, Error, Success, Disabled - semua test
□ Responsive Portrait UI: mobile-friendly, touch target 44×44dp
- Asset Architecture: semua asset reference melalui config, tidak hardcode
- Data & UI terpisah: UI ambil dari data source terpusat
- New Player Flow: onboarding + tutorial + first battle + reward kerja
- Error & Connection State: loading, error, retry, transaction pending
- Performance: UI ringan, tes di mobile kelas menengah
- Implementation Rule: komponen modular, bukan satu file besar
- Testing Plan: navigation, battle, hero, gacha, UI state semua test
- FIRST-TIME PLAYER EXPERIENCE: tutorial singkat + bisa skip

✓ Semua fitur Economy/Tokenomics/GRAMLangsung tidak dibuat (aturan Phase 1-4)
✓ Tidak ada Marketplace, PvP, Guild, Equipment di UI ini
✓ Placeholder asset BOLEH digunakan untuk testing
✓ Jangan menunggu artwork final untuk menguji interaction
✓ Setiap angka/yang belum final diberi label TENTATIVE
✓ Prioritas: WORKING SYSTEM > USABILITY > PERFORMANCE > VISUAL POLISH
✓ BUKAN lanjut ke Phase 6

