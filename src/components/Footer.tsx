'use client';

import Link from 'next/link';
import { Train, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Train className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TrainTrack</span>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-red-400" />
            <span>{t('footer.tagline')}</span>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-start">
            <p>{t('footer.aetBased')}</p>
            <p>&copy; {currentYear} {t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
