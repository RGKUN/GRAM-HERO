const Utils = {
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  clamp(v, a, b) { return Math.max(a, Math.min(b, v)); },
  lerp(a, b, t) { return a + (b - a) * t; },
  hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  },
  generateUUID() { return 'xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random()*16).toString(16)); }
};
class EventBus {
  constructor() { this.l = {}; }
  on(e, cb) { (this.l[e] = this.l[e] || []).push(cb); }
  emit(e, d) { (this.l[e] || []).forEach(cb => cb(d)); }
}
const events = new EventBus();
