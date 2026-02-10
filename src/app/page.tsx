'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useLanguage, Locale } from '@/lib/i18n';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
}

export default function HomePage() {
  const router = useRouter();
  const { locale, setLocale } = useLanguage();
  const t = useLanguage().t;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const particleIdRef = useRef(0);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const totalSlides = 3;

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setShowLangDropdown(false);
  };

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Mouse trail particle effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (Math.random() > 0.8) {
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.015,
        size: Math.random() * 6 + 4,
      };
      setParticles(prev => [...prev.slice(-30), newParticle]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Animate particles
  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - p.decay,
          }))
          .filter(p => p.alpha > 0)
      );
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/classes');
  };

  const changeSlide = (n: number) => {
    setCurrentSlide(n);
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInContent {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-wrapper {
          height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .sidebar {
          background: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          box-shadow: 2px 0 8px rgba(47, 63, 88, 0.08);
          overflow: hidden;
        }

        .carousel-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
          pointer-events: none;
        }

        .carousel-slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        .carousel-controls {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .control-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-dot.active {
          background: #96c652;
          width: 28px;
          border-radius: 5px;
        }

        .feature-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 1.5rem;
          width: 100%;
          max-width: 300px;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem 1rem;
          background: #f9fbf6;
          border-radius: 0.6rem;
          border-left: 3px solid #96c652;
          transition: all 0.3s ease;
        }

        .highlight-item:hover {
          background: #eef5e0;
          transform: translateX(4px);
        }

        .login-form-section {
          background: #f5f2ee;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          overflow-y: auto;
        }

        .login-form-container {
          width: 100%;
          max-width: 380px;
        }

        .form-header {
          margin-bottom: 2rem;
          animation: slideInContent 0.5s ease-out;
        }

        .form-group {
          margin-bottom: 1.5rem;
          animation: slideInContent 0.5s ease-out;
        }

        .form-group:nth-child(2) {
          animation-delay: 0.1s;
        }

        .form-group:nth-child(3) {
          animation-delay: 0.2s;
        }

        .feature-block {
          background: #f9fbf6;
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #e8ebe6;
          transition: all 0.3s ease;
        }

        .feature-block:hover {
          border-color: #d4e7b8;
          box-shadow: 0 4px 12px rgba(150, 198, 82, 0.1);
          transform: translateY(-4px);
        }

        .login-button {
          width: 100%;
          padding: 1rem;
          background: #96c652;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          margin-top: 0.5rem;
        }

        .login-button:hover {
          background: #7aa83a;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(150, 198, 82, 0.3);
        }

        .login-button:active {
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .login-wrapper {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }

          .login-form-section {
            justify-content: flex-start;
            padding-top: 4rem;
          }
        }
      `}</style>

      {/* Mouse trail particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            borderRadius: '50%',
            background: '#7dd956',
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            opacity: Math.max(0, particle.alpha),
            zIndex: 9999,
          }}
        />
      ))}

      <div className="login-wrapper">
        {/* Sidebar with Carousel */}
        <aside className="sidebar">
          <div className="carousel-container">
            {/* Slide 1: Personalized Learning */}
            <div className={`carousel-slide ${currentSlide === 0 ? 'active' : ''}`} style={{ gap: '1.5rem' }}>
              <h2 style={{ fontSize: '2.75rem', fontWeight: 700, color: '#2f3f58', margin: 0, lineHeight: 1.3, letterSpacing: '-0.5px' }}>
                {t('homepage.slide1Title')}
              </h2>
              <p style={{ fontSize: '1rem', color: '#7a8492', fontWeight: 400, lineHeight: 1.8, margin: 0, maxWidth: '90%' }}>
                {t('homepage.slide1Description')}
              </p>
              
              {/* Feature Highlights */}
              <div className="feature-highlights">
                <div className="highlight-item">
                  <div style={{ width: '24px', height: '24px', background: '#96c652', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <div style={{ fontSize: '0.9rem', color: '#2f3f58', fontWeight: 500, lineHeight: 1.4 }}>{t('homepage.highlight1')}</div>
                </div>
                <div className="highlight-item">
                  <div style={{ width: '24px', height: '24px', background: '#96c652', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <div style={{ fontSize: '0.9rem', color: '#2f3f58', fontWeight: 500, lineHeight: 1.4 }}>{t('homepage.highlight2')}</div>
                </div>
                <div className="highlight-item">
                  <div style={{ width: '24px', height: '24px', background: '#96c652', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <div style={{ fontSize: '0.9rem', color: '#2f3f58', fontWeight: 500, lineHeight: 1.4 }}>{t('homepage.highlight3')}</div>
                </div>
              </div>

              {/* Stats Badges */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#f9fbf6', padding: '0.7rem 1.2rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, color: '#618232', border: '1px solid #d4e7b8' }}>
                  {t('homepage.badge1')}
                </div>
                <div style={{ background: '#f9fbf6', padding: '0.7rem 1.2rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, color: '#618232', border: '1px solid #d4e7b8' }}>
                  {t('homepage.badge2')}
                </div>
                <div style={{ background: '#f9fbf6', padding: '0.7rem 1.2rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, color: '#618232', border: '1px solid #d4e7b8' }}>
                  {t('homepage.badge3')}
                </div>
              </div>
            </div>

            {/* Slide 2: Features */}
            <div className={`carousel-slide ${currentSlide === 1 ? 'active' : ''}`} style={{ gap: '2rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2f3f58', margin: 0, lineHeight: 1.3, letterSpacing: '-0.4px' }}>
                {t('homepage.slide2Title')}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#7a8492', fontWeight: 400, margin: 0 }}>
                {t('homepage.slide2Description')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', width: '100%' }}>
                <div className="feature-block">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.feature1Title')}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#7a8492', margin: 0, lineHeight: 1.6, textAlign: 'left' }}>{t('homepage.feature1Description')}</p>
                </div>
                <div className="feature-block">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.feature2Title')}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#7a8492', margin: 0, lineHeight: 1.6, textAlign: 'left' }}>{t('homepage.feature2Description')}</p>
                </div>
                <div className="feature-block">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.feature3Title')}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#7a8492', margin: 0, lineHeight: 1.6, textAlign: 'left' }}>{t('homepage.feature3Description')}</p>
                </div>
                <div className="feature-block">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.feature4Title')}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#7a8492', margin: 0, lineHeight: 1.6, textAlign: 'left' }}>{t('homepage.feature4Description')}</p>
                </div>
              </div>
            </div>

            {/* Slide 3: How It Works */}
            <div className={`carousel-slide ${currentSlide === 2 ? 'active' : ''}`} style={{ gap: '2rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2f3f58', margin: 0, lineHeight: 1.3, letterSpacing: '-0.4px' }}>
                {t('homepage.slide3Title')}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#7a8492', fontWeight: 400, margin: 0 }}>
                {t('homepage.slide3Description')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem', width: '100%' }}>
                <div style={{ textAlign: 'left', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: '#96c652', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.step1Title')}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#7a8492', margin: 0, lineHeight: 1.7 }}>{t('homepage.step1Description')}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'left', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: '#96c652', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.step2Title')}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#7a8492', margin: 0, lineHeight: 1.7 }}>{t('homepage.step2Description')}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'left', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: '#96c652', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>3</div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0' }}>{t('homepage.step3Title')}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#7a8492', margin: 0, lineHeight: 1.7 }}>{t('homepage.step3Description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="carousel-controls">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`control-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => changeSlide(index)}
              />
            ))}
          </div>
        </aside>

        {/* Login Form Section */}
        <section className="login-form-section" style={{ position: 'relative' }}>
          {/* Language Switcher - Top Right */}
          <div 
            ref={langDropdownRef}
            style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50, display: 'flex', alignItems: 'center' }}
          >
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: '#7a8492',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8ebe6';
                e.currentTarget.style.color = '#618232';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#7a8492';
              }}
              aria-label="Change language"
            >
              <span className="mx-1.5">{locale === 'en' ? 'EN' : 'ع'}</span>
              <Globe style={{ width: '20px', height: '20px' }} />
            </button>

            {showLangDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '4px',
                width: '160px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid #e8ebe6',
                padding: '4px 0',
                zIndex: 50,
              }}>
                <button
                  onClick={() => handleLanguageChange('en')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    border: 'none',
                    background: locale === 'en' ? '#f9fbf6' : 'transparent',
                    color: locale === 'en' ? '#618232' : '#2f3f58',
                    fontWeight: locale === 'en' ? 600 : 400,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fbf6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = locale === 'en' ? '#f9fbf6' : 'transparent'}
                >
                  <span>EN</span>
                  <span>English</span>
                  {locale === 'en' && (
                    <span style={{ marginLeft: 'auto', width: '8px', height: '8px', background: '#96c652', borderRadius: '50%' }} />
                  )}
                </button>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    border: 'none',
                    background: locale === 'ar' ? '#f9fbf6' : 'transparent',
                    color: locale === 'ar' ? '#618232' : '#2f3f58',
                    fontWeight: locale === 'ar' ? 600 : 400,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fbf6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = locale === 'ar' ? '#f9fbf6' : 'transparent'}
                >
                  <span>ع</span>
                  <span>العربية</span>
                  {locale === 'ar' && (
                    <span style={{ marginLeft: 'auto', width: '8px', height: '8px', background: '#96c652', borderRadius: '50%' }} />
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="login-form-container">
            <div className="form-header">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2f3f58', margin: '0 0 0.5rem 0', letterSpacing: '-0.3px' }}>
                {/* Welcome Back */}
                <img src="LogoTT.svg" />
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#7a8492', margin: 0, fontWeight: 400 }}>
                {t('homepage.signInSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3f58', marginBottom: '0.5rem' }}>
                  {t('homepage.emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('homepage.emailPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    border: '1.5px solid #e8ebe6',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.3s ease',
                    background: 'white',
                    color: '#2f3f58',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#96c652';
                    e.target.style.boxShadow = '0 0 0 3px rgba(150, 198, 82, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8ebe6';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2f3f58', marginBottom: '0.5rem' }}>
                  {t('homepage.passwordLabel')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('homepage.passwordPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    border: '1.5px solid #e8ebe6',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.3s ease',
                    background: 'white',
                    color: '#2f3f58',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#96c652';
                    e.target.style.boxShadow = '0 0 0 3px rgba(150, 198, 82, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8ebe6';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button type="submit" className="login-button">
                {t('homepage.signInButton')}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#7a8492', marginTop: '1.5rem' }}>
              {t('homepage.noAccount')}{' '}
              <button
                type="button"
                onClick={() => router.push('/classes')}
                style={{ color: '#618232', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontFamily: "'Poppins', sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#96c652')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#618232')}
              >
                {t('homepage.createOne')}
              </button>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
