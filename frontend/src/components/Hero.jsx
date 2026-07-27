import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: 'easeOut' } }),
};

export default function Hero() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [loadedPercent, setLoadedPercent] = useState(0);

  // Failsafe: Never show the loading screen for more than 4 seconds, even on slow connections
  useEffect(() => {
    const timer = setTimeout(() => setLoadedPercent(100), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const TOTAL = 300;
    const FOLDER = '/frames';
    const srcs = Array.from({ length: TOTAL }, (_, i) =>
      `${FOLDER}/frame_${String(i + 1).padStart(6, '0')}.jpg`
    );

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const animWrap = wrapRef.current;

    const imgs = new Array(TOTAL).fill(null);
    let loaded = 0;
    let curIdx = -1;
    let targIdx = 0;
    let dispIdx = 0;
    let rafId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw(true);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    function redraw(force) {
      let idx = Math.max(0, Math.min(TOTAL - 1, Math.round(dispIdx)));
      let img = imgs[idx];
      if (!img) {
        for (let d = 1; d < TOTAL; d++) {
          if (idx - d >= 0 && imgs[idx - d]) { img = imgs[idx - d]; break; }
          if (idx + d < TOTAL && imgs[idx + d]) { img = imgs[idx + d]; break; }
        }
      }
      if (!img) return;
      const di = imgs.indexOf(img);
      if (di === curIdx && !force) return;
      curIdx = di;
      
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      ctx.drawImage(img, (cw - iw * s) * 0.5, (ch - ih * s) * 0.5, iw * s, ih * s);
    }

    function tick() {
      rafId = requestAnimationFrame(tick);
      dispIdx += (targIdx - dispIdx) * 0.18;
      redraw(false);
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

    function loadOne(src, idx) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          imgs[idx] = img;
          loaded++;
          setLoadedPercent(Math.floor((loaded / TOTAL) * 100));
          resolve();
        };
        img.onerror = () => {
          // If an image fails to load, still count it as "processed" so we don't block the UI
          loaded++;
          setLoadedPercent(Math.floor((loaded / TOTAL) * 100));
          resolve();
        };
        img.src = src;
      });
    }

    async function loadAll() {
      await loadOne(srcs[0], 0);
      redraw(true);
      rafId = requestAnimationFrame(tick);
      
      const intervals = [149, 299, 74, 224, 37, 112, 187, 262];
      await Promise.all(intervals.map(i => loadOne(srcs[i], i)));
      
      const rem = [];
      for(let i=1; i<TOTAL; i++) {
        if(!imgs[i]) rem.push(i);
      }
      
      for(let i=0; i<rem.length; i+=10) {
        const batch = rem.slice(i, i+10);
        await Promise.all(batch.map(idx => loadOne(srcs[idx], idx)));
      }
    }
    loadAll();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
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
