import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: 'easeOut' } }),
};

export default function Hero() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const TOTAL = 300;
    const FOLDER = '/frames';

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const animWrap = wrapRef.current;

    // Cache of loaded images — only loaded on demand
    const cache = {};
    const loading = {};

    let curDrawn = -1;
    let targIdx = 0;
    let dispIdx = 0;
    let rafId = null;

    function src(i) {
      return `${FOLDER}/frame_${String(i + 1).padStart(6, '0')}.jpg`;
    }

    function loadFrame(i) {
      if (cache[i] || loading[i]) return;
      loading[i] = true;
      const img = new Image();
      img.onload = () => { cache[i] = img; delete loading[i]; };
      img.onerror = () => { delete loading[i]; };
      img.src = src(i);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(Math.round(dispIdx), true);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    function draw(idx, force) {
      if (idx === curDrawn && !force) return;
      let img = cache[idx];
      // Fallback: find nearest loaded frame
      if (!img) {
        for (let d = 1; d < 30; d++) {
          if (cache[idx - d]) { img = cache[idx - d]; break; }
          if (cache[idx + d]) { img = cache[idx + d]; break; }
        }
      }
      if (!img) return;
      curDrawn = idx;
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      ctx.drawImage(img, (cw - iw * s) * 0.5, (ch - ih * s) * 0.5, iw * s, ih * s);
    }

    function tick() {
      rafId = requestAnimationFrame(tick);
      dispIdx += (targIdx - dispIdx) * 0.18;
      const idx = Math.max(0, Math.min(TOTAL - 1, Math.round(dispIdx)));
      draw(idx, false);

      // Preload current frame + 10 frames ahead + 5 behind only
      for (let d = -5; d <= 10; d++) {
        const f = idx + d;
        if (f >= 0 && f < TOTAL) loadFrame(f);
      }
    }

    const onScroll = () => {
      if (!animWrap) return;
      const wrapTop = animWrap.offsetTop;
      const maxScroll = animWrap.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const heroScroll = Math.max(0, Math.min(maxScroll, window.scrollY - wrapTop));
      targIdx = Math.round((heroScroll / maxScroll) * (TOTAL - 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Load only first frame immediately, then start the loop
    loadFrame(0);
    const waitFirst = setInterval(() => {
      if (cache[0]) {
        clearInterval(waitFirst);
        draw(0, true);
        rafId = requestAnimationFrame(tick);
      }
    }, 50);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      clearInterval(waitFirst);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="hero" ref={wrapRef} style={{ position: 'relative', height: '250vh', backgroundColor: '#14213D' }}>

      {/* Sticky Canvas Container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Dark overlay for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,33,61,0.85) 0%, rgba(20,33,61,0.4) 50%, transparent 100%)', pointerEvents: 'none' }} />

        {/* Hero Content Overlay */}
        <div className="container" style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 1.5rem', paddingTop: 'clamp(5rem, 18vw, 2rem)' }}>
          <div style={{ maxWidth: '760px' }}>
            {/* 5-star badge */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <div className="five-star-badge" style={{ marginBottom: '1.75rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '50px', color: '#fff', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span style={{ color: '#F59E0B', fontSize: '1rem', marginRight: '0.5rem' }}>★★★★★</span>
                5-Star Rated Business in Dadri
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={0.15}
              style={{
                fontFamily: 'Poppins', fontWeight: 900, color: '#ffffff',
                fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.15, marginBottom: '1.25rem',
              }}
            >
              Powering Homes with{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF8A00, #FFD700)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Clean Solar Energy
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
              style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '2.5rem', maxWidth: '580px', lineHeight: 1.7 }}>
              Authorized UTL Solar dealer in Dadri, UP. We supply & install solar panels, batteries, inverters, and complete solar systems — with expert guidance and after-sales support.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0.45}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <a href="tel:+919873403889" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                📞 Call Now
              </a>
              <a
                href="https://wa.me/919873403889?text=Hi%2C%20I'm%20interested%20in%20solar%20panels%2Fbatteries%20%E2%80%94%20please%20share%20a%20free%20quote"
                target="_blank" rel="noopener noreferrer"
                className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                💬 Get Free Quote
              </a>
            </motion.div>

            {/* Quick Trust Badges */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0.6}
              style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🏆', label: 'Authorized UTL Dealer' },
                { icon: '⚡', label: '500+ Installations' },
                { icon: '🛡️', label: 'Warranty Assured' },
              ].map(badge => (
                <div key={badge.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500,
                }}>
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', zIndex: 10
          }}>
          <span>Scroll down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
