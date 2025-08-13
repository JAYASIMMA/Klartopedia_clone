import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ThemeSettings from "../../components/ThemeSettings";
import { FiMenu, FiBell, FiSettings, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const { darkMode, setDarkMode, sidebarColor, setSidebarColor } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleThemeSettings = () => setIsThemeSettingsOpen(!isThemeSettingsOpen);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100`}>
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} color={sidebarColor} onClose={() => setIsSidebarOpen(false)} />

        <div className={`flex-1 transition-all duration-300 p-4 ${isSidebarOpen ? "md:ml-[240px]" : "md:ml-[70px]"}`}>
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur border rounded-xl p-3 mb-4 flex items-center justify-between">
            <button className="p-2 rounded border bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700" onClick={toggleSidebar}>
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
            <div className="flex items-center gap-3">
              <select className="border rounded px-2 py-1 bg-white dark:bg-slate-700">
                <option>2023-2024</option>
                <option>2024-2025</option>
              </select>
              <button
                aria-label="Toggle dark mode"
                className={"p-2 rounded border " + (darkMode ? "bg-slate-900 text-yellow-300 border-slate-700" : "bg-white text-slate-700 border-slate-200")}
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to light" : "Switch to dark"}
              >
                {darkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
              <FiBell size={20} />
              <FiSettings size={20} className="cursor-pointer" onClick={toggleThemeSettings} />
              <img src="https://i.pravatar.cc/40" alt="User" className="w-9 h-9 rounded-full" />
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {["Total Students","Total Classes","Total Teachers","Total Staff"].map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 text-center">
                <h3 className="text-sm font-medium mb-1">{t}</h3>
                <p className="text-xl font-bold text-indigo-600">{[89,13,22,14][i]}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="No record found"
                className="w-24 mb-4"
              />
              <p>No Record Found</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
              <h4 className="font-semibold">Average Class Attendance</h4>
              <p className="text-sm text-slate-500 dark:text-slate-300">0 Students (Average)</p>
              <div className="w-full h-40 rounded bg-slate-200 dark:bg-slate-700 mt-2 flex items-center justify-center text-slate-500">Chart Here</div>
            </div>
          </div>
        </div>
      </div>

      {isThemeSettingsOpen && (
        <ThemeSettings
          onClose={toggleThemeSettings}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarColor={sidebarColor}
          setSidebarColor={setSidebarColor}
        />
      )}
    </div>
  );
};

export default Home;
