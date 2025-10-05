import { Link, useLocation } from "react-router-dom";
import { Home, Search, Workflow, Mail, Activity } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Lead Search", path: "/leads", icon: Search },
  { name: "SDR Workflow", path: "/workflow", icon: Workflow },
  { name: "Email", path: "/email", icon: Mail },
  { name: "Agent Status", path: "/status", icon: Activity },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                Sales Agent AI
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - could add user menu, notifications, etc */}
          <div className="flex items-center">
            <div className="status-indicator">
              <div className="status-dot online"></div>
              <span className="text-sm text-gray-600">API Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  isActive
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
