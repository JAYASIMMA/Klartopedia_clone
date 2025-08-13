// src/pages/caste/Caste.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import ThemeSettings from "../../components/ThemeSettings";
import { FiMenu, FiBell, FiSettings, FiSun, FiMoon, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { getCastes, addCaste, updateCaste, deleteCaste } from "../../services/casteService";
import { useTheme } from "../../context/ThemeContext";

interface Caste {
  id: number;
  name: string;
}

const CastePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const { darkMode, setDarkMode, sidebarColor, setSidebarColor } = useTheme();

  const [castes, setCastes] = useState<Caste[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const getPageNumbers = (totalPages: number, current: number): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages)
    } else if (current >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', totalPages)
    }
    return pages
  }

  const loadCastes = async () => {
    setLoading(true);
    try {
      const data = await getCastes();
      const formatted: Caste[] = data.map((item: any) => ({ id: item.id ?? 0, name: item.name }));
      setCastes(formatted);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Error loading castes:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCastes();
  }, []);

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    try {
      if (editIndex !== null) {
        const item = castes[editIndex];
        await updateCaste(item.id, { name: inputValue });
        Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
      } else {
        await addCaste({ name: inputValue });
        Swal.fire({ icon: "success", title: "Added!", timer: 1200, showConfirmButton: false });
      }
      setInputValue("");
      setEditIndex(null);
      await loadCastes();
    } catch (err: any) {
      console.error("Error saving caste:", err.response?.data || err.message);
      Swal.fire({ icon: "error", title: "Error", text: "Save failed - check console/network tab." });
    }
  };

  const handleDelete = async (index: number) => {
    const item = castes[index];
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${item.name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCaste(item.id);
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
        await loadCastes();
      } catch (err: any) {
        console.error("Error deleting caste:", err.response?.data || err.message);
        Swal.fire({ icon: "error", title: "Error", text: "Delete failed - check console/network tab." });
      }
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100` }>
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} color={sidebarColor} onClose={() => setIsSidebarOpen(false)} />
        <div className={`flex-1 transition-all duration-300 p-4 ${isSidebarOpen ? "md:ml-[240px]" : "md:ml-[70px]"}`}>
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur border rounded-xl p-3 mb-4 flex items-center justify-between">
            <button className="p-2 rounded border bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-semibold">Caste Management</h1>
            <div className="flex items-center gap-3">
              <button
                aria-label="Toggle dark mode"
                className={"p-2 rounded border " + (darkMode ? "bg-slate-900 text-yellow-300 border-slate-700" : "bg-white text-slate-700 border-slate-200")}
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to light" : "Switch to dark"}
              >
                {darkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
              <FiBell size={20} />
              <FiSettings size={20} className="cursor-pointer" onClick={() => setIsThemeSettingsOpen(!isThemeSettingsOpen)} />
              <img src="https://i.pravatar.cc/40" alt="User" className="w-9 h-9 rounded-full" />
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
              <h2 className="text-base font-semibold mb-3">{editIndex !== null ? "Edit Caste" : "Add Caste"}</h2>
              <input
                type="text"
                placeholder="Enter caste name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700"
              />
              <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded" onClick={handleSave}>
                Save
              </button>
              <button
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded ml-2"
                onClick={() => { setInputValue(""); setEditIndex(null); }}
              >
                Reset
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 overflow-auto">
              <h2 className="text-base font-semibold mb-3">Caste List</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 pr-2">S.No</th>
                      <th className="py-2 pr-2">Caste Name</th>
                      <th className="py-2 pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {castes.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-slate-500">No records found</td>
                      </tr>
                    ) : (
                      castes
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((item, index) => (
                          <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700">
                            <td className="py-2 pr-2">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="py-2 pr-2">{item.name}</td>
                            <td className="py-2 pr-2">
                              <div className="flex items-center gap-3">
                                <FiEdit
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setInputValue(item.name);
                                    setEditIndex((currentPage - 1) * pageSize + index);
                                  }}
                                />
                                <FiTrash2 className="text-rose-500 cursor-pointer" onClick={() => handleDelete((currentPage - 1) * pageSize + index)} />
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
              {/* Pagination */}
              {castes.length > pageSize && (
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    className="px-3 py-1 rounded border bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {getPageNumbers(Math.ceil(castes.length / pageSize), currentPage).map((p, i) => (
                    typeof p === 'number' ? (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded border bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 ${p === currentPage ? ' !bg-slate-900 !text-white dark:!bg-slate-100 dark:!text-slate-900' : ''}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    ) : (
                      <span key={i} className="px-2">{p}</span>
                    )
                  ))}
                  <button
                    className="px-3 py-1 rounded border bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === Math.ceil(castes.length / pageSize)}
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(castes.length / pageSize), p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isThemeSettingsOpen && (
        <ThemeSettings onClose={() => setIsThemeSettingsOpen(false)} darkMode={darkMode} setDarkMode={setDarkMode} sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      )}
    </div>
  );
};

export default CastePage;
