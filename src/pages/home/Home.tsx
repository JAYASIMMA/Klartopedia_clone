import React, { useState } from "react";
import Layout from "../../components/Layout";
import ThemeSettings from "../../components/ThemeSettings";
import { FiSettings, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const Home: React.FC = () => {
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const { darkMode, setDarkMode, sidebarColor, setSidebarColor } = useTheme();

  const toggleThemeSettings = () => setIsThemeSettingsOpen(!isThemeSettingsOpen);

  return (
    <>
      <Layout title="Dashboard">
        <div className="flex items-center justify-between mb-4">
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
            <FiSettings size={20} className="cursor-pointer" onClick={toggleThemeSettings} />
          </div>
        </div>

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
      </Layout>

      {isThemeSettingsOpen && (
        <ThemeSettings
          onClose={toggleThemeSettings}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarColor={sidebarColor}
          setSidebarColor={setSidebarColor}
        />
      )}
    </>
  );
};

export default Home;
