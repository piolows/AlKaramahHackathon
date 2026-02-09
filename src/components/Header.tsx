'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: '/classes', label: 'Classes' },
  { href: '/admin', label: 'Admin', icon: <Settings className="h-4 w-4" /> },
];

export default function Header() {
  const pathname = usePathname();
  
  // Check if a link is active (exact match or starts with for nested routes)
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Brand - matching login page style */}
          <Link href="/classes" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #1E3A8A 100%)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C4 12 8 6 12 6C16 6 20 12 20 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12C4 12 8 18 12 18C16 18 20 12 20 12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <circle cx="6" cy="12" r="2" fill="white" />
                <circle cx="12" cy="8" r="2" fill="#F97316" />
                <circle cx="18" cy="12" r="2" fill="white" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight" style={{ color: '#1E3A8A' }}>TrainTrack</span>
              <p className="text-xs text-gray-500">Empowering Teachers</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-green-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                // style={isActive(link.href) ? { background: 'linear-gradient(135deg, #4ADE80 0%, #1E3A8A 100%)', borderBottom: '5px solid red'} : {}}
                style={isActive(link.href) ? { borderBottom: '4px solid var(--accent-500)'} : {}}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
