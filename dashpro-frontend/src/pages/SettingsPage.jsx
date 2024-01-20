import React, { useState, useContext } from 'react';
import { User, Lock, Palette, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card-bg border border-custom rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-custom bg-light-main dark:bg-dark-main/30 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-accent-primary text-white'
                      : 'text-sub hover:bg-light-card dark:hover:bg-dark-card hover:text-light-text dark:hover:text-dark-text'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6 pb-6 border-b border-custom">
                <div className="w-20 h-20 rounded-full bg-accent-primary text-white flex items-center justify-center text-2xl font-bold">
                  {user?.avatar || 'AD'}
                </div>
                <div>
                  <h3 className="text-lg font-medium">Profile Photo</h3>
                  <p className="text-sm text-sub mb-3">Avatar is generated from your initials.</p>
                  <button onClick={() => toast.success('Photo upload dialog simulated')} className="px-4 py-2 border border-custom rounded-lg text-sm font-medium hover:bg-light-main dark:hover:bg-dark-main transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-primary text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      readOnly
                      className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 text-sm opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-primary text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1.5">Role</label>
                    <input 
                      type="text" 
                      defaultValue={user?.role}
                      readOnly
                      className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 text-sm opacity-70 cursor-not-allowed capitalize"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-accent-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-medium mb-4">Change Password</h2>
              <form onSubmit={handleSave} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-sub mb-1.5">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-primary text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sub mb-1.5">New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-primary text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sub mb-1.5">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-light-main dark:bg-dark-main border border-custom rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-primary text-sm transition-colors"
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-accent-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm">
                    Update Password
                  </button>
                </div>
              </form>

              <div className="mt-10 pt-6 border-t border-custom">
                <h2 className="text-lg font-medium mb-2">Two-Factor Authentication</h2>
                <p className="text-sm text-sub mb-4">Add an extra layer of security to your account.</p>
                <button onClick={() => toast.success('2FA verification code sent to your device')} className="px-4 py-2 border border-custom rounded-lg text-sm font-medium hover:bg-light-main dark:hover:bg-dark-main transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-lg font-medium mb-4">Theme</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`flex-1 p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${theme === 'light' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-custom hover:bg-light-main dark:hover:bg-dark-main text-sub'}`}
                  >
                    <div className="w-full h-24 bg-light-main rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                      <div className="h-4 bg-white border-b border-gray-200 w-full"></div>
                      <div className="flex-1 flex">
                        <div className="w-1/4 h-full bg-slate-800"></div>
                        <div className="w-3/4 h-full bg-slate-50 p-2"><div className="w-1/2 h-full bg-white rounded shadow-sm border border-gray-100"></div></div>
                      </div>
                    </div>
                    <span className="font-medium flex items-center gap-2">
                      Light Mode {theme === 'light' && <CheckCircle2 size={16} />}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`flex-1 p-4 border rounded-xl flex flex-col items-center gap-3 transition-colors ${theme === 'dark' ? 'border-accent-primary bg-accent-primary/5 text-accent-primary' : 'border-custom hover:bg-light-main dark:hover:bg-dark-main text-sub'}`}
                  >
                    <div className="w-full h-24 bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden flex flex-col shadow-sm">
                      <div className="h-4 bg-[#1C2128] border-b border-[#30363D] w-full"></div>
                      <div className="flex-1 flex">
                        <div className="w-1/4 h-full bg-[#0D1117]"></div>
                        <div className="w-3/4 h-full p-2"><div className="w-1/2 h-full bg-[#1C2128] rounded border border-[#30363D]"></div></div>
                      </div>
                    </div>
                    <span className="font-medium flex items-center gap-2">
                      Dark Mode {theme === 'dark' && <CheckCircle2 size={16} />}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">Accent Color</h2>
                <div className="flex gap-4">
                  {['blue', 'green', 'purple', 'gold', 'red'].map((color) => {
                    const colorMap = {
                      blue: 'bg-[#1E90FF]',
                      green: 'bg-[#10B981]',
                      purple: 'bg-[#8B5CF6]',
                      gold: 'bg-[#F59E0B]',
                      red: 'bg-[#EF4444]',
                    };
                    return (
                      <button 
                        key={color}
                        className={`w-10 h-10 rounded-full ${colorMap[color]} flex items-center justify-center transition-transform hover:scale-110`}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                      >
                        {color === 'blue' && <CheckCircle2 size={20} className="text-white" />}
                      </button>
                    )
                  })}
                </div>
                <p className="text-sm text-sub mt-3">Color customization implementation is partially complete in this version.</p>
              </div>

              <div className="pt-4">
                <button onClick={handleSave} className="px-6 py-2.5 bg-accent-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
