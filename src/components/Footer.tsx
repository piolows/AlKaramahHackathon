import Link from 'next/link';
import { Train, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white" style={{ background: 'linear-gradient(135deg, var(--dark-blue-600) 0%, var(--dark-blue-900) 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--primary-300) 0%, var(--primary-400) 100%)' }}>
              <Train className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TrainTrack</span>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-400)' }}>
            <Heart className="h-4 w-4" style={{ color: 'var(--danger-300)' }} />
            <span>Built with love for special education teachers</span>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--primary-400)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left" style={{ color: 'var(--accent-400)' }}>
            <p>Based on the Autism Education Trust (AET) Progression Framework</p>
            <p>© {currentYear} TrainTrack. Created for Al Karamah Hackathon.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
