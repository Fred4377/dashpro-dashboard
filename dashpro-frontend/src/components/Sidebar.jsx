import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen, closeMobile }) => {
  const { user, logout } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full sidebar-bg border-r border-custom text-light-text dark:text-dark-text transition-all duration-300">
      <div className="h-16 flex items-center justify-between px-4 border-b border-custom">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="min-w-8 h-8 rounded bg-accent-primary flex items-center justify-center text-white font-bold">
            DP
          </div>
          {isOpen && <span className="font-bold text-xl whitespace-nowrap tracking-wide">DashPro</span>}
        </div>
        
        <button className="lg:hidden text-sub hover:text-light-text dark:hover:text-dark-text" onClick={closeMobile}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <ul className="space-y-1 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
                      isActive
                        ? 'bg-accent-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-dark-card text-sub hover:text-light-text dark:hover:text-dark-text'
                    } ${!isOpen && 'justify-center'}`
                  }
                  title={!isOpen ? link.name : ''}
                >
                  <Icon size={20} className="min-w-5" />
                  {isOpen && <span className="font-medium whitespace-nowrap">{link.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-custom">
        <div className={`flex items-center ${!isOpen ? 'justify-center' : 'gap-3'} mb-4`}>
          <div className="w-9 h-9 rounded-full bg-accent-purple text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user?.avatar || 'AD'}
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-sub truncate">{user?.role || 'admin'}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={logout}
          className={`flex items-center w-full text-sub hover:text-accent-danger transition-colors ${!isOpen ? 'justify-center' : 'gap-3 px-3 py-2'}`}
          title={!isOpen ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-light-card dark:bg-dark-card border border-custom rounded-full items-center justify-center text-sub hover:text-accent-primary z-10"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </div>
  );
};

export default Sidebar;
