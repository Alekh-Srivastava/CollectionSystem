import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/collections', label: 'Collections' },
    { path: '/collections/create', label: 'Create Collection' },
    { path: '/products', label: 'Products' },
    { path: '/collections/review', label: 'Review Collections' },
  ];

  return (
    <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                prefetch={true}
                className={`inline-flex items-center px-3 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-cyan-300/80 hover:text-cyan-300 hover:border-cyan-400/30'
                }`}
                style={{ height: '64px' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyan-300 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  prefetch={true}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-cyan-400/10 text-cyan-400'
                      : 'text-cyan-300/80 hover:bg-cyan-400/5 hover:text-cyan-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
