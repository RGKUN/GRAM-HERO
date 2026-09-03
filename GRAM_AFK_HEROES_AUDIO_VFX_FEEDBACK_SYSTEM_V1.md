GRAM AFK HEROES — AUDIO, VFX & FEEDBACK SYSTEM V1

PERAN: Senior Game Feel Designer + VFX Designer + Audio Systems Engineer

FOKUS: Sound Effect, Background Music, Battle VFX, Hit/Damage/Skill/Ultimate/Heal/Critical/Death/Victory/Defeat Effect, UI Feedback, Screen Feedback, Camera Feedback, Audio/VFX Management.

TUJUAN: Membuat setiap aksi penting dalam game terasa jelas, responsif, memuaskan, dan mudah dipahami pemain.

BATASAN: Jangan mengubah sistem gameplay utama. Jangan membangun Cinematic, Cutscene Editor, Dynamic Music, Multiplayer Audio Sync, atau Blockchain effects.

---

1. ASSET RULE

Semua Audio, VFX, Animation, Sprite, UI Effect, Background Music harus dipisahkan dari Game Logic.

Jangan hardcode nama file audio, sprite tertentu, VFX tertentu, atau animation tertentu ke sistem Battle.

Gunakan:
Skill ID → Skill Configuration → VFX ID → Asset Manager → VFX Asset

Bukan: Skill Fireball → langsung memanggil file tertentu

PLACEHOLDER diperbolehkan. Semua placeholder harus mudah diganti dengan asset final tanpa mengubah Game Logic.

---

2. AUDIO MANAGER

Audio Manager terpusat bertanggung jawab terhadap:
- SFX (Sound Effects)
- BGM (Background Music)
- Volume control per channel
- Mute per channel
- Audio Priority
- Audio Pooling (jika diperlukan)
- Audio configuration (table → sound asset reference)

Game Logic TIDAK mengontrol Audio secara langsung. Game Logic cukup meminta Play SFX: "HIT_EFFECT". Audio Manager menentukan file yang dimainkan.

---

3. SOUND EFFECT CATEGORY

BATTLE:
- basic_attack
- hit
- critical_hit
- miss
- enemy_death
- boss_hit
- boss_death

HERO:
- hero_skill
- hero_ultimate
- heal
- buff
- debuff
- shield

UI:
- button_click
- confirm
- cancel
- open_panel
- close_panel
- reward
- gacha_result

SYSTEM:
- victory
- defeat
- level_up
- achievement
- quest_complete

Setiap SFX memiliki asset reference yang dapat diganti.

---

4. BACKGROUND MUSIC

BGM kategori:

| ID | Context |
|----|---------|
| bgm_main_menu | Main menu / Home |
| bgm_normal_battle | Battle vs Koroco |
| bgm_boss_battle | Battle vs Boss |
| bgm_victory | Victory screen |
| bgm_defeat | Defeat screen |

Untuk versi awal: 5 track BGM.

Transition:
- Main → Battle: fade out 1 detik, fade in 1 detik
- Battle → Boss: crossfade 0.5 detik
- Battle → Victory: stop immediately, play victory
- Battle → Defeat: stop immediately, play defeat

Semua BGM configurable via asset reference. Placeholder boleh digunakan.

---

5. AUDIO SETTINGS

Settings player:

| Setting | Default | Range |
|---------|---------|-------|
| Master Volume | 100% | 0-100 |
| Music Volume | 80% | 0-100 |
| SFX Volume | 90% | 0-100 |
| Mute Music | false | bool |
| Mute SFX | false | bool |

Disimpan di player settings (Phase 6 persistence).

---

6. VFX MANAGER

VFX Manager terpusat mengatur:
- Spawn VFX
- Destroy VFX
- Object Pooling
- Duration
- Position
- Scale
- Direction
- Target (follow hero/enemy)

Game Logic meminta:
Play VFX: "FIREBALL_PROJECTILE" di posisi X

VFX Manager menentukan asset yang digunakan dan mengelola lifecycle.

---

7. BASIC ATTACK EFFECT

Setiap Basic Attack mempunyai feedback visual:

Melee (Swordman/Tank):
- Attack animation
- Slash effect (2-3 frame)
- Hit spark di posisi target
- Damage number muncul

Ranged (Mage):
- Projectile launch effect
- Projectile terbang
- Impact effect di target
- Damage number muncul

Healer:
- Healing projectile atau area effect
- Heal number (hijau)
- Healing particles

---

8. DAMAGE NUMBER SYSTEM

Jenis Damage Number:

| Type | Tampilan | Warna |
|------|----------|-------|
| Normal Damage | "120" | Putih |
| Critical Damage | "CRIT! 350" | Kuning/Emas + lebih besar |
| Heal | "+250" | Hijau |
| Shield | "+100" | Biru |
| Miss | "MISS" | Abu-abu |

Animasi:
- Muncul dari posisi target
- Float ke atas 1-2 detik
- Fade out

Ukuran: harus mudah dibaca di layar mobile.

Object pooling untuk damage number (sering muncul/hilang).

---

9. CRITICAL HIT FEEDBACK

Critical harus terasa berbeda dari normal.

Kombinasi:
- Damage Number: lebih besar, "CRIT!" prefix, warna emas
- Hit VFX: lebih besar dari normal hit
- SFX: suara kritis yang lebih tajam/keras
- Screen feedback: small shake (opsional, 0.1 detik)

Jangan membuat efek terlalu berlebihan sehingga mengganggu gameplay.

---

10. SKILL EFFECT

Setiap skill memiliki:
- Cast effect (saat hero menggunakan skill)
- Projectile/Area effect (jika ada)
- Hit effect (saat damage/heal diterima)
- Sound (cast + hit)
- Damage/Heal feedback (number)

Configuration:
skill_id → vfx_cast_id → vfx_hit_id → sfx_cast_id → sfx_hit_id

Contoh:

| Skill | Cast VFX | Hit VFX | Cast SFX | Hit SFX |
|-------|----------|---------|----------|---------|
| Slash | slash_cast | slash_impact | slash_cast | slash_hit |
| Fireball | fireball_cast | fireball_impact | fireball_cast | fireball_hit |
| Heal Light | heal_cast | heal_aura | heal_cast | heal_hit |
| Shield Bash | bash_cast | bash_impact | bash_cast | bash_hit |

Semua via configuration, bukan hardcode.

---

11. ULTIMATE EFFECT

Ultimate harus terasa lebih kuat daripada Basic Attack dan Skill.

Kombinasi:
- Hero berhenti sejenak (cast preparation)
- Screen emphasis (subtle darkening atau flash)
- VFX lebih kuat/besar dari skill normal
- SFX lebih dramatic
- Impact effect lebih besar
- Damage number lebih besar

Namun tetap perhatikan mobile performance. Ultimate tidak harus fullscreen animation.

Pertimbangan:
- 1-2 detik cast animation (tidak lebih)
- Tidak ada full-screen cutscene
- VFX intensity scalable berdasarkan device performance

---

12. HERO CLASS VISUAL IDENTITY

SWORDMAN:
- Slash effects (terang, cepat)
- Sword impact (spark, metallic)
- Fast attack animation
- Warna: silver/blue

TANK:
- Shield effects (solid, defensive)
- Armor impact (heavy, robust)
- Defensive aura
- Warna: brown/orange

MAGE:
- Magic projectiles (glow, trail)
- Explosions (fire, ice, arcane)
- Elemental particles
- Warna: purple/blue

HEALER:
- Healing light (warm, soft)
- Sparkles (small particles)
- Healing circle/aura
- Warna: green/gold

Setiap class memiliki identity visual yang konsisten. Final artwork dapat diganti.

---

13. HEAL EFFECT

Healing harus terlihat jelas dan berbeda dari damage.

- Green/bright healing indicator
- Heal number (+250, warna hijau)
- Healing particles (sparkles, light orbs)
- Healing aura di sekitar target
- SFX: healing/restore sound

Player harus langsung memahami bahwa Hero sedang disembuhkan.

---

14. BUFF & DEBUFF EFFECT

| Effect | Visual Indicator |
|--------|-----------------|
| Attack Up | Sword icon hijau + aura merah |
| Defense Up | Shield icon biru + aura biru |
| Speed Up | Lightning icon kuning |
| Attack Down | Sword icon merah + aura merah pudar |
| Defense Down | Shield icon merah |
| Stun | Stars/eyes above head |
| Slow | Cloud/slowness icon |

Gunakan icon kecil + VFX sederhana. Jangan terlalu banyak status effect untuk versi awal.

---

15. KOROCO FEEDBACK

Koroco = monster biasa, bukan crocodile.

Feedback sederhana:
- Spawn: muncul dengan fade in singkat (0.2 detik)
- Idle: sedikit animation
- Attack: attack animation + SFX
- Hit: hit flash + damage number + SFX
- Death: death animation + fade out + SFX

VFX harus ringan karena Koroco muncul berkali-kali dan dalam jumlah banyak.

---

16. BOSS FEEDBACK

Boss harus terasa berbeda dari Koroco.

Boss dapat memiliki:
- Spawn effect (larger, dramatic)
- Boss entrance (animation + SFX + screen emphasis)
- Stronger hit effect
- Unique skill VFX (per boss, minimal 1)
- Rage effect (ketika HP rendah)
- Death effect (dramatic, particles, screen feedback)

Setiap Boss memiliki minimal satu visual identity. Namun gunakan reusable VFX components untuk performa.

---

17. BOSS ENTRANCE

Flow Boss Entrance:

Wave terakhir Koroco selesai
    ↓
Semua Koroco menghilang
    ↓
Screen emphasis (brief darken)
    ↓
Boss entrance animation
    ↓
Boss muncul dengan SFX
    ↓
Boss HP bar tampil
    ↓
Battle dilanjutkan

Durasi: 1-2 detik maksimal.

---

18. BOSS DEATH

Boss Death = event penting.

- Death animation (lebih panjang dari Koroco)
- Death particles (lebih banyak)
- SFX dramatic
- Screen feedback (subtle shake)
- Victory transition

Setelah efek selesai (1-2 detik), tampilkan Victory/Reward UI.

---

19. VICTORY FEEDBACK

Flow Victory:

Boss/Koroco terakhir mati
    ↓
Victory SFX (fanfare)
    ↓
"VICTORY" text muncul
    ↓
Reward animation (Gold, XP, Diamond, Equipment)
    ↓
Progression update
    ↓
Player bisa tap untuk lanjut

Jangan langsung pindahkan player ke screen lain. Berikan waktu untuk melihat reward.

---

20. DEFEAT FEEDBACK

Flow Defeat:

Semua Hero mati
    ↓
Defeat SFX (tidak terlalu harsh)
    ↓
"DEFEAT" text muncul
    ↓
Retry button + Exit button
    ↓
Informasi penyebab jika sesuai

Jangan membuat player bingung bagaimana melanjutkan.

---

21. LEVEL UP FEEDBACK

Ketika Hero naik level:

- Level Up VFX (particles, glow)
- Level Up SFX (celebration)
- "LEVEL UP!" text
- New Level display (Lv. 12 → Lv. 13)
- Stat change display (opsional, singkat)

---

22. GACHA FEEDBACK

Gacha = moment menarik.

START:
- Button press feedback (SFX + visual)
- Animation countdown atau reveal start

RESULT:
- Reveal animation (card flip atau similar)
- Rarity color per level:
  - Common: grey
  - Rare: blue
  - Epic: purple
  - Legendary: gold
  - Mythic: rainbow/prismatic
- Hero/Skill reveal
- Reward SFX per rarity

Rarity visual hierarchy:
- Semakin tinggi rarity → reveal effect semakin kuat
- Tapi tidak menipu atau menyembunyikan drop rate

---

23. UI FEEDBACK

Button states:
- Normal: default
- Pressed: scale down + darken + SFX
- Disabled: grey + no response
- Loading: spinner
- Success: flash hijau + SFX
- Error: flash merah + SFX

Untuk mobile: feedback visual yang jelas saat tombol ditekan (tap feedback).

---

24. SCREEN FEEDBACK

| Event | Screen Effect |
|-------|---------------|
| Critical Hit | Small shake (0.1 detik) |
| Boss Hit | Small flash |
| Boss Death | Medium shake (0.3 detik) |
| Victory | Flash + emphasis |
| Defeat | Subtle darken |
| Ultimate | Brief emphasis |

Tidak berlebihan. Untuk mobile: Clarity > spectacle.

---

25. ACCESSIBILITY

Informasi penting tidak hanya disampaikan melalui warna.

- Critical Hit: icon + text "CRIT!" + size + sound (bukan hanya warna kuning)
- Heal: icon + text "+250" + particles (bukan hanya warna hijau)
- Buff/Debuff: icon + label (bukan hanya warna aura)
- Victory/Defeat: text besar + SFX (bukan hanya layar berubah warna)

---

26. PERFORMANCE

VFX harus memperhatikan mobile.

Hindari:
- Particle berlebihan
- Banyak object dibuat/dihancurkan terus-menerus
- Texture besar
- Efek transparansi berlebihan
- Fullscreen effect terus-menerus

Object Pooling untuk:
- Damage Numbers
- Hit Effects
- Projectiles
- Particles
- Temporary VFX

Batasan:
- Max active VFX: 20-30 sekaligus (TENTATIVE)
- Max particles per effect: 10-20 (TENTATIVE)
- Damage number lifetime: 1-2 detik

---

27. VFX POOL

Flow:

Pool Created (startup)
    ↓
Request VFX dari Game Logic
    ↓
VFX Manager mengambil dari Pool
    ↓
VFX diposisikan dan dimainkan
    ↓
VFX selesai → kembali ke Pool
    ↓
Pool reuse untuk berikutnya

Hindari membuat object baru setiap hit jika menyebabkan GC spikes.

---

28. AUDIO POOLING

Audio Pool untuk SFX sering:
- Hit
- Basic Attack
- Koroco Death

Jangan memainkan terlalu banyak SFX identik sekaligus.

Strategi:
- Cooldown: SFX yang sama minimal 50ms berikutnya
- Volume limit: max 5 instance SFX identical
- Priority: Boss SFX > Hero SFX > Koroco SFX
- Pooling: reuse audio source

---

29. AUTO BATTLE COMPATIBILITY

VFX dan Audio TIDAK mengubah hasil Battle.

Auto Battle menggunakan sistem gameplay yang sama.

Feedback mengikuti action yang benar-benar terjadi (baik auto maupun manual).

Tidak ada perbedaan VFX/Audio antara auto dan manual.

---

30. BATTLE SPEED

Jika Battle Speed tersedia (1x, 2x, 3x):

| Speed | Animation | VFX | SFX |
|-------|-----------|-----|-----|
| 1x | Normal | Normal | Normal |
| 2x | 2x faster | Same visual, shorter duration | Same pitch |
| 3x | 3x faster | Same visual, shorter duration | Same pitch |

Pastikan gameplay timing, animation, VFX, SFX tetap sinkron.

Pada speed tinggi, SFX boleh di-skip untuk menghindari overlapping. VFX durasi dikurangi.

---

31. AUDIO/VFX CONFIGURATION

Data models:

EffectDefinition:
- effect_id: string
- type: enum (VFX, SFX, SCREEN_SHAKE, FLASH)
- asset_reference: string
- duration: float (ms)
- scale: float
- priority: int

SkillEffectDefinition:
- skill_id: string
- cast_vfx_id: string
- hit_vfx_id: string
- cast_sfx_id: string
- hit_sfx_id: string

RarityEffectDefinition:
- rarity: enum
- reveal_vfx_id: string
- reveal_sfx_id: string
- aura_vfx_id: string

BossEffectDefinition:
- boss_id: string
- entrance_vfx_id: string
- entrance_sfx_id: string
- death_vfx_id: string
- death_sfx_id: string
- skill_vfx_ids: list

Semua via configuration. Artwork/audio dapat diganti tanpa mengubah Logic.

---

32. TESTING

AUDIO:
- [ ] BGM Main Menu dimainkan
- [ ] BGM Normal Battle dimainkan
- [ ] BGM Boss Battle dimainkan
- [ ] BGM Victory dimainkan
- [ ] BGM Defeat dimainkan
- [ ] Transition BGM smooth
- [ ] SFX dimainkan untuk setiap action
- [ ] Volume control berfungsi
- [ ] Mute berfungsi

VFX:
- [ ] Basic Attack effect muncul
- [ ] Hit effect muncul
- [ ] Critical effect berbeda dari normal
- [ ] Heal effect terlihat jelas
- [ ] Skill effect per class
- [ ] Ultimate effect lebih kuat
- [ ] Boss entrance
- [ ] Boss death
- [ ] Victory effect
- [ ] Defeat effect

UI FEEDBACK:
- [ ] Button pressed feedback
- [ ] Button disabled state
- [ ] Reward popup animation
- [ ] Gacha reveal per rarity
- [ ] Level Up display

PERFORMANCE:
- [ ] Banyak Koroco: VFX tidak lag
- [ ] Banyak Damage Number: tidak lag
- [ ] Boss Battle: VFX smooth
- [ ] Auto Battle: tidak ada memory leak
- [ ] Battle Speed 2x/3x: sinkron
- [ ] Mobile performance acceptable

ASSET REPLACEMENT:
- [ ] Ganti audio file → gameplay tidak rusak
- [ ] Ganti VFX asset → gameplay tidak rusak
- [ ] Ganti animation → gameplay tidak rusak
- [ ] Ganti sprite → gameplay tidak rusak

---

33. DEVELOPMENT TOOLS

HANYA Development/Test:

| Tool | Fungsi |
|------|--------|
| play_vfx | Play VFX tertentu |
| play_sfx | Play SFX tertentu |
| test_skill_vfx | Test VFX untuk skill |
| test_boss_vfx | Test VFX untuk boss |
| test_damage_number | Spawn damage number |
| test_victory | Play victory sequence |
| test_defeat | Play defeat sequence |
| test_gacha_reveal | Test gacha reveal per rarity |
| toggle_vfx | ON/OFF semua VFX |
| toggle_audio | ON/OFF semua audio |

Tidak boleh tersedia di Production.

---

34. BATASAN PHASE 9

JANGAN dibangun mendalam:
- Cinematic system kompleks
- Cutscene editor
- Advanced dynamic music system
- Multiplayer audio synchronization
- Blockchain audio/VFX
- NFT effects
- Marketplace effects

---

35. FINAL DECISIONS

- Audio Manager terpusat, game logic tidak control audio langsung
- VFX Manager terpusat, game logic request VFX by ID
- 5 kategori BGM (main menu, normal battle, boss battle, victory, defeat)
- 4 kategori SFX (battle, hero, UI, system)
- Damage Number: normal, critical, heal, shield, miss
- Critical feedback: bigger number + bigger VFX + SFX + screen shake
- Heal visual: green particles + heal number + healing aura
- Boss entrance: 1-2 detik, screen emphasis + SFX
- Boss death: dramatic particles + screen shake
- Victory: SFX fanfare + reward animation
- Defeat: subtle + retry/exit button
- Gacha reveal: rarity visual hierarchy (grey → rainbow)
- Object Pooling untuk damage number, hit effect, projectile
- Audio Pooling untuk SFX sering
- Battle Speed sinkron: animation shortened, SFX skip jika perlu
- Accessibility: informasi tidak hanya dari warna
- Semua via configuration (asset reference), bukan hardcode
- Placeholder diperbolehkan

---

36. PROPOSAL

- Dynamic music intensity (music berubah berdasarkan battle intensity)
- Screen-wide ultimate animation (boss killer move)
- Parallax background per stage
- Weather effects per stage (rain, snow, fog)
- Pet/companion VFX
- Achievement unlock cinematic (3 detik)

---

37. TENTATIVE — NEEDS PLAYTEST

- Max active VFX sekaligus (20-30?)
- Max particles per effect (10-20?)
- Damage number lifetime (1-2 detik?)
- Screen shake intensity (0.1-0.3 detik?)
- Audio cooldown (50ms?)
- Audio max instance identical (5?)
- Ultimate cast duration (1-2 detik?)
- Boss entrance duration (1-2 detik?)
- Battle Speed 3x: animation skip threshold

---

38. FUTURE FEATURE

- Dynamic music system
- Cinematic system
- Cutscene editor
- Weather/Parallax effects
- Pet/companion VFX
- Achievement cinematic
- Multiplayer audio sync
- NFT/Blockchain effects

---

39. PHASE 9 COMPLETION CHECKLIST

AUDIO
- [x] Audio Manager terpusat
- [x] BGM: 5 track (main, normal battle, boss, victory, defeat)
- [x] SFX: 4 kategori (battle, hero, UI, system)
- [x] Volume Control (master, music, SFX)
- [x] Mute per channel
- [x] Audio Settings (tersimpan di player data)

VFX
- [x] VFX Manager terpusat
- [x] Hit Effect
- [x] Skill Effect (per class)
- [x] Ultimate Effect
- [x] Heal Effect
- [x] Critical Effect
- [x] Boss Entrance
- [x] Boss Death
- [x] Victory Effect
- [x] Defeat Effect

FEEDBACK
- [x] Damage Number (normal, critical, heal, shield, miss)
- [x] Critical Feedback (size, sound, screen)
- [x] Level Up
- [x] Gacha Reveal (per rarity)
- [x] Reward Feedback
- [x] UI Button Feedback

PERFORMANCE
- [x] Object Pooling (damage number, hit, projectile)
- [x] Audio Pooling (sering SFX)
- [x] Mobile performance (max VFX, max particles)
- [x] Battle Speed sinkron

ASSET
- [x] Semua Audio via asset reference (dapat diganti)
- [x] Semua VFX via asset reference (dapat diganti)
- [x] Semua Animation via asset reference (dapat diganti)
- [x] Tidak ada asset yang di-hardcode ke Gameplay Logic
- [x] Placeholder diperbolehkan dan mudah diganti

FINAL RULE: Jangan mulai Phase 10. HANYA Phase 9.

