'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Train, Settings, Globe } from 'lucide-react';
import { useLanguage, Locale } from '@/lib/i18n';

interface NavLink {
  href: string;
  labelKey: string;
  icon?: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: '/classes', labelKey: 'nav.classes' },
  { href: '/admin', labelKey: 'nav.admin', icon: <Settings className="h-4 w-4" /> },
];

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if a link is active (exact match or starts with for nested routes)
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Train className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TrainTrack</span>
          </Link>

          {/* Navigation + Language Switcher */}
          <div className="flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>

            {/* Language Switcher */}
            <div className="relative ms-2" ref={dropdownRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                title={t('common.language')}
                aria-label={t('common.language')}
              >
                <Globe className="h-5 w-5" />
              </button>

              {showLangDropdown && (
                <div className="absolute end-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in-scale">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      locale === 'en'
                        ? 'text-primary-700 bg-primary-50 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">EN</span>
                    <span>English</span>
                    {locale === 'en' && (
                      <span className="ms-auto w-2 h-2 bg-primary-500 rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      locale === 'ar'
                        ? 'text-primary-700 bg-primary-50 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">ع</span>
                    <span>العربية</span>
                    {locale === 'ar' && (
                      <span className="ms-auto w-2 h-2 bg-primary-500 rounded-full"></span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
