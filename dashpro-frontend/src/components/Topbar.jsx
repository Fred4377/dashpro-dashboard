import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, User } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Topbar = ({ toggleMobileSidebar }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Format page title based on path
  const path = location.pathname.split('/')[1];
  const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';

  return (
    <header className="h-16 card-bg border-b border-custom px-4 lg:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileSidebar}
          className="lg:hidden text-sub hover:text-light-text dark:hover:text-dark-text"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sub" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-light-main dark:bg-dark-main border border-custom focus:outline-none focus:border-accent-primary transition-colors text-sm"
          />
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-main text-sub transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-main text-sub transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-accent-danger rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 card-bg border border-custom rounded-lg shadow-lg overflow-hidden py-2 z-50">
              <div className="px-4 py-2 border-b border-custom">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[1,2,3].map(i => (
                  <div key={i} className="px-4 py-3 border-b border-custom hover:bg-light-main dark:hover:bg-dark-main cursor-pointer last:border-0">
                    <p className="text-sm font-medium">New Order #{1040 + i}</p>
                    <p className="text-xs text-sub mt-1">2 mins ago</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            onBlur={() => setTimeout(() => setShowProfile(false), 200)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center font-medium text-sm">
              {user?.avatar || 'AD'}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 card-bg border border-custom rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-custom mb-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-sub truncate">{user?.email}</p>
              </div>
              <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-light-main dark:hover:bg-dark-main cursor-pointer">
                <User size={16} /> Profile Settings
              </a>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-danger hover:bg-light-main dark:hover:bg-dark-main cursor-pointer text-left"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
