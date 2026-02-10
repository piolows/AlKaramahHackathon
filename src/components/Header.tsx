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

interface HeaderProps {
  showNavLinks?: boolean;
}

export default function Header({ showNavLinks = true }: HeaderProps) {
  const pathname = usePathname();
  
  // Check if a link is active (exact match or starts with for nested routes)
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo & Brand - matching login page style */}
          <Link href="/classes" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="py-4">
              <img  src="./LogoTT.svg" width="130"/>
          </div>
            <div>
            </div>
          </Link>

          {/* Navigation */}
          {showNavLinks && (
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-primary-800 hover:text-[var(--primary-blue-500)]'
                      : 'text-gray-600 hover:text-[var(--primary-blue-500)]'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {/* Animated bottom border */}
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: 'var(--primary-800)',
                      transform: isActive(link.href) ? 'scaleX(1)' : 'scaleX(0)',
                      opacity: isActive(link.href) ? 1 : 0,
                      transformOrigin: 'center bottom'
                    }}
                  />
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
