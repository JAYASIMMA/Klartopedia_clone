// src/pages/board/Board.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import ThemeSettings from "../../components/ThemeSettings";
import { FiMenu, FiBell, FiSettings, FiSun, FiMoon, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { getBoards, addBoard, updateBoard, deleteBoard, BoardType } from "../../services/boardService";
import { useTheme } from "../../context/ThemeContext";

const Board: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const { darkMode, setDarkMode, sidebarColor, setSidebarColor } = useTheme();

  const [boards, setBoards] = useState<BoardType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeStatus, setActiveStatus] = useState<number>(1);
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

  const normalizeActive = (val: any): number => {
    if (typeof val === "number") return val === 1 ? 1 : 0;
    if (val && typeof val === "object" && "data" in val) {
      return (val as any).data[0] === 1 ? 1 : 0;
    }
    return 0;
  };

  const loadBoards = async () => {
    setLoading(true);
    try {
      const data = await getBoards();
      const normalizedData = data.map((item: any) => ({ id: item.id, name: item.name, active: normalizeActive(item.active) }));
      setBoards(normalizedData);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Error loading boards:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    try {
      if (editIndex !== null) {
        const item = boards[editIndex];
        await updateBoard(item.id!, { name: inputValue, active: activeStatus });
        Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
      } else {
        await addBoard({ name: inputValue, active: activeStatus });
        Swal.fire({ icon: "success", title: "Added!", timer: 1200, showConfirmButton: false });
      }
      setInputValue("");
      setActiveStatus(1);
      setEditIndex(null);
      await loadBoards();
    } catch (err: any) {
      console.error("Error saving board:", err.response?.data || err.message);
      Swal.fire({ icon: "error", title: "Error", text: "Save failed - check console." });
    }
  };

  const handleDelete = async (index: number) => {
    const item = boards[index];
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
        await deleteBoard(item.id!);
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
        await loadBoards();
      } catch (err: any) {
        console.error("Error deleting board:", err.response?.data || err.message);
        Swal.fire({ icon: "error", title: "Error", text: "Delete failed - check console." });
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
            <h1 className="text-lg font-semibold">Boards</h1>
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
              <h2 className="text-base font-semibold mb-3">{editIndex !== null ? "Edit Board" : "Add Board"}</h2>
              <input
                type="text"
                placeholder="Enter board name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700"
              />
              {/*
              <select value={activeStatus} onChange={(e) => setActiveStatus(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700">
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              */}
              <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
              <button
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded ml-2"
                onClick={() => { setInputValue(''); setActiveStatus(1); setEditIndex(null); }}
              >
                Reset
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 overflow-auto">
              <h2 className="text-base font-semibold mb-3">Board List</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 pr-2">S.No</th>
                      <th className="py-2 pr-2">Board Name</th>
                      <th className="py-2 pr-2">Active</th>
                      <th className="py-2 pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boards.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-500">No records found</td>
                      </tr>
                    ) : (
                      boards
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((item, index) => (
                          <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700">
                            <td className="py-2 pr-2">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="py-2 pr-2">{item.name}</td>
                            <td className="py-2 pr-2">{item.active === 1 ? "Yes" : "No"}</td>
                            <td className="py-2 pr-2">
                              <div className="flex items-center gap-3">
                                <FiEdit
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setInputValue(item.name);
                                    // setActiveStatus(item.active);
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
              {boards.length > pageSize && (
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    className="px-3 py-1 rounded border bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {getPageNumbers(Math.ceil(boards.length / pageSize), currentPage).map((p, i) => (
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
                    disabled={currentPage === Math.ceil(boards.length / pageSize)}
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(boards.length / pageSize), p + 1))}
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

export default Board;
