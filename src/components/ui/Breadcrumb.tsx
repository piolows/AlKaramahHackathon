'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 rtl:space-x-reverse">
      <Link href="/" className="hover:text-primary-600 transition-colors">
        {t('breadcrumb.home')}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
