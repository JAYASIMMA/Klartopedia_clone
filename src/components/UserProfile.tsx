import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';

interface UserProfileProps {
  isSidebarOpen: boolean;
  color?: 'blue' | 'cyan' | 'indigo' | 'violet' | 'rose' | 'emerald' | 'slate';
}

const UserProfile: React.FC<UserProfileProps> = ({ isSidebarOpen, color = 'blue' }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const colorToClasses: Record<NonNullable<UserProfileProps['color']>, string> = {
    blue: 'bg-blue-800',
    cyan: 'bg-cyan-700',
    indigo: 'bg-indigo-700',
    violet: 'bg-violet-700',
    rose: 'bg-rose-700',
    emerald: 'bg-emerald-700',
    slate: 'bg-slate-700',
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (!user) return null;

  return (
    <div className={`${colorToClasses[color]} p-4 border-t border-white/10`}>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 w-full text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <FiUser className="text-white" />
          </div>
          {isSidebarOpen && (
            <>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-white/70 truncate">{user.role}</p>
              </div>
              <FiChevronDown 
                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </>
          )}
        </button>

        {isDropdownOpen && isSidebarOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="p-3 border-b border-gray-200 dark:border-slate-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.username}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
