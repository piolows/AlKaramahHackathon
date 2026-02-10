'use client';

import Link from 'next/link';
import { Train, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white" style={{ background: 'linear-gradient(135deg, var(--dark-blue-600) 0%, var(--dark-blue-900) 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img src="/DarkTTstk.svg" width="120" />
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-400)' }}>
            <Heart className="h-4 w-4" style={{ color: 'var(--danger-300)' }} />
            <span>{t('footer.tagline')}</span>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--primary-400)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left" style={{ color: 'var(--accent-400)' }}>
            <p>{t('footer.aetBased')}</p>
            <p>© {currentYear} {t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
