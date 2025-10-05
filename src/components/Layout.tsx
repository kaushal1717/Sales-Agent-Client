import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Database, Activity, Zap } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Lead Finder', href: '/leads', icon: Search },
  { name: 'Sessions', href: '/sessions', icon: Database },
  { name: 'Status', href: '/status', icon: Activity },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="brutal-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-black border-4 border-black">
                <Zap className="h-7 w-7 text-brutal-yellow" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                  Sales Agent
                </h1>
                <p className="text-xs font-bold text-black -mt-1 uppercase tracking-wider">AI-Powered</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 border-4 border-black font-bold text-sm uppercase transition-all ${
                      isActive
                        ? 'bg-black text-brutal-yellow shadow-brutal'
                        : 'bg-white text-black hover:bg-brutal-yellow hover:text-black hover:shadow-brutal'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 bg-black text-brutal-yellow border-4 border-black hover:bg-brutal-yellow hover:text-black transition-all">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}