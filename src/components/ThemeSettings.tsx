import React from 'react';

type SidebarColor = 'blue' | 'cyan' | 'indigo' | 'violet' | 'rose' | 'emerald' | 'slate';

interface ThemeProps {
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarColor?: SidebarColor;
  setSidebarColor?: React.Dispatch<React.SetStateAction<SidebarColor>>;
}

const colors: SidebarColor[] = ['blue','cyan','indigo','violet','rose','emerald','slate'];

const ThemeSettings: React.FC<ThemeProps> = ({ onClose, darkMode, setDarkMode, sidebarColor = 'blue', setSidebarColor }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-[92%] max-w-md rounded-xl shadow-lg bg-white dark:bg-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Theme Settings</h3>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Mode</p>
            <div className="inline-flex rounded border overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${!darkMode ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-700'}`}
                onClick={() => setDarkMode(false)}
              >Light</button>
              <button
                className={`px-3 py-1 text-sm ${darkMode ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-700'}`}
                onClick={() => setDarkMode(true)}
              >Dark</button>
            </div>
          </div>

          {setSidebarColor && (
            <div>
              <p className="text-sm font-medium mb-2">Sidebar Color</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSidebarColor(c)}
                    className={`w-8 h-8 rounded-full ring-2 ring-offset-2 ${sidebarColor === c ? 'ring-slate-900 dark:ring-white' : 'ring-transparent'} ` +
                      ({
                        blue: 'bg-blue-700',
                        cyan: 'bg-cyan-600',
                        indigo: 'bg-indigo-600',
                        violet: 'bg-violet-600',
                        rose: 'bg-rose-600',
                        emerald: 'bg-emerald-600',
                        slate: 'bg-slate-700',
                      } as Record<SidebarColor, string>)[c]}
                    aria-label={`Set ${c}`}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
