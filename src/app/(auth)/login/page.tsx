'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Cursor trail effect - bubbles trail behind the cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // Calculate the direction of movement
    const deltaX = currentX - lastPosition.current.x;
    const deltaY = currentY - lastPosition.current.y;
    
    // Only create bubbles if there's movement
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      // Position bubbles behind the cursor (opposite to movement direction)
      const trailDistance = 15;
      const angle = Math.atan2(deltaY, deltaX);
      const trailX = currentX - Math.cos(angle) * trailDistance;
      const trailY = currentY - Math.sin(angle) * trailDistance;
      
      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x: trailX + (Math.random() - 0.5) * 10,
        y: trailY + (Math.random() - 0.5) * 10,
        size: Math.random() * 20 + 10,
        opacity: 0.6,
      };
      setBubbles(prev => [...prev.slice(-20), newBubble]);
    }
    
    lastPosition.current = { x: currentX, y: currentY };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Fade out bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({ ...bubble, opacity: bubble.opacity - 0.03 }))
          .filter(bubble => bubble.opacity > 0)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login - always redirects to classes page
    router.push('/classes');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--background) 0%, var(--primary-50) 30%, var(--background) 60%, var(--primary-50) 100%)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Cursor Trail Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="fixed pointer-events-none rounded-full"
          style={{
            left: bubble.x - bubble.size / 2,
            top: bubble.y - bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: 'var(--primary-400)',
            opacity: bubble.opacity,
            transform: `scale(${bubble.opacity})`,
            transition: 'transform 0.1s ease-out',
            zIndex: 9999,
          }}
        />
      ))}

      {/* Header without navigation links */}
      <Header showNavLinks={false} />

      {/* Centered Login Form */}
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--dark-blue-600)' }}>
              Welcome back
            </h2>
            <p className="text-gray-600 mt-2">
              Sign in to continue guiding every step of progress
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-blue-600)' }}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  style={{ backgroundColor: 'var(--background)' }}
                  placeholder="Enter your username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-blue-600)' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  style={{ backgroundColor: 'var(--background)' }}
                  placeholder="Enter your password"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" style={{ accentColor: 'var(--primary-400)' }} />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="cursor-pointer font-medium hover:underline" style={{ color: 'var(--primary-400)' }}>
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="cursor-pointer w-full py-3 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl shadow-md"
                style={{ background: 'linear-gradient(135deg, var(--primary-300) 0%, var(--primary-400) 100%)' }}
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-600">
            Don&apos;t have an account?{' '}
            <button 
              type="button"
              onClick={() => router.push('/classes')}
              className="cursor-pointer font-semibold hover:underline" 
              style={{ color: 'var(--primary-400)' }}
            >
              Sign up
            </button>
          </p>

          {/* Footer Text */}
          <p className="text-center mt-8 text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
