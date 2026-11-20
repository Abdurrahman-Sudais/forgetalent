import {startFx} from './fx.js';

// ForgeTalent interactions: the shared reveal/cursor layer plus sparks that fly from the pointer on click,
// like striking metal. Sparks live outside the React root and are skipped for reduced-motion users.
export function startMotion() {
  startFx({cursor: 'ember', prefix: 'ft', tilt: 7, magnet: 0.3});
  if (typeof window === 'undefined' || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  addEventListener('pointerdown', (e) => {
    for (let i = 0; i < 10; i += 1) {
      const s = document.createElement('i'); s.className = 'ft-spark'; s.setAttribute('aria-hidden', 'true');
      const a = Math.random() * Math.PI * 2; const d = 30 + Math.random() * 50;
      s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 20}px`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 700);
    }
  });
}
