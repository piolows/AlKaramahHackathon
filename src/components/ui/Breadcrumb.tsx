'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t, locale } = useLanguage();
  const isRTL = locale === 'ar';

  return (
    <nav style={{
      padding: '0.75rem 2rem',
      background: 'white',
      fontSize: '0.85rem',
      fontWeight: 500,
      borderBottom: '1px solid #f0f0f0',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <Link 
        href="/classes" 
        style={{ color: '#2f3f58', textDecoration: 'none', fontWeight: 500 }}
      >
        {t('breadcrumb.home')}
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index}>
            <span style={{ color: '#d1d5db', margin: '0 0.5rem' }}>
              {isRTL ? '<' : '>'}
            </span>
            {item.href && !isLast ? (
              <Link 
                href={item.href} 
                style={{ color: '#2f3f58', textDecoration: 'none', fontWeight: 500 }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: '#618232', fontWeight: 600 }}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
