// Preloaded game assets
const ASSETS = {
  bgHome: null,
  bgStage: null
};

(function preloadAssets() {
  const images = [
    { key: 'bgHome', src: 'assets/bg_home.png' },
    { key: 'bgStage', src: 'assets/bg_stage.png' }
  ];
  images.forEach(({ key, src }) => {
    const img = new Image();
    img.onload = () => { ASSETS[key] = img; console.log('[ASSETS] Loaded:', key); };
    img.onerror = () => { console.error('[ASSETS] Failed:', src); };
    img.src = src;
  });
})();
