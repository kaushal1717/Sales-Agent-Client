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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="glass-effect shadow-2xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl pulse-glow">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">
                  Sales Agent
                </h1>
                <p className="text-xs text-gray-400 -mt-1">AI-Powered</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 shadow-lg border border-blue-500/40 backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-2 transition-colors duration-300 ${
                      isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 transition-all duration-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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