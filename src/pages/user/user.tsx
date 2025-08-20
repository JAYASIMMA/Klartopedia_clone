// src/pages/users/User.tsx
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import ThemeSettings from "../../components/ThemeSettings";
import { FiSettings, FiSun, FiMoon, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { getAllActiveAdminUsers, registerUserAdmin, updateAdminUser, deleteAdminUser } from "../../services/userAdmin";
import { useTheme } from "../../context/ThemeContext";
import { setUserCache, getUserCache } from "../../utils/cacheUtils";

interface AdminUser {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  mobile_number: string;
  active_status: number; // 0 or 1
}

const User: React.FC = () => {
  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);
  const { darkMode, setDarkMode, sidebarColor, setSidebarColor } = useTheme();

  const [users, setUsers] = useState<AdminUser[]>([]);
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

  // Form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [activeStatus, setActiveStatus] = useState<number>(1);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Try to get cached data first
      const cachedUsers = getUserCache<AdminUser[]>('admin_users');
      if (cachedUsers) {
        setUsers(cachedUsers);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      const res = await getAllActiveAdminUsers();
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
        setCurrentPage(1);
        // Cache the users data for 5 minutes
        setUserCache('admin_users', res.data, 5 * 60 * 1000);
      } else {
        console.error("Error fetching users:", res.message);
      }
    } catch (err: any) {
      console.error("Error loading users:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !username.trim() || (!editIndex && !password.trim()) || !role.trim() || !mobile.trim()) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "Please fill in all required fields." });
      return;
    }

    try {
      if (editIndex !== null) {
        const user = users[editIndex];
        const payload: any = { id: user.id, name, username, role, mobile_number: mobile, active_status: activeStatus };
        if (password.trim()) payload.password = password;
        const res = await updateAdminUser(payload);
        if (res.success) {
          Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
        } else {
          throw new Error(res.message);
        }
      } else {
        const res = await registerUserAdmin({ name, username, password, role, mobile_number: mobile, active_status: activeStatus });
        if (res.success) {
          Swal.fire({ icon: "success", title: "Added!", timer: 1200, showConfirmButton: false });
        } else {
          throw new Error(res.message);
        }
      }
      resetForm();
      await loadUsers();
    } catch (err: any) {
      console.error("Error saving user:", err.message || err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Save failed - check console/network tab." });
    }
  };

  const handleDelete = async (index: number) => {
    const user = users[index];
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${user.username}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteAdminUser(user.id);
        if (res.success) {
          Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
          await loadUsers();
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        console.error("Error deleting user:", err.message || err);
        Swal.fire({ icon: "error", title: "Error", text: err.message || "Delete failed - check console/network tab." });
      }
    }
  };

  const resetForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setRole("");
    setMobile("");
    setActiveStatus(1);
    setEditIndex(null);
  };

  return (
    <>
      <Layout title="Admin Users">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle dark mode"
              className={"p-2 rounded border " + (darkMode ? "bg-slate-900 text-yellow-300 border-slate-700" : "bg-white text-slate-700 border-slate-200")}
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to light" : "Switch to dark"}
            >
              {darkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>
            <FiSettings size={20} className="cursor-pointer" onClick={() => setIsThemeSettingsOpen(!isThemeSettingsOpen)} />
          </div>
        </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
              <h2 className="text-base font-semibold mb-3">{editIndex !== null ? "Edit Admin User" : "Add Admin User"}</h2>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700" />
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700" />
              <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700" />
              <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full border rounded px-3 py-2 mb-4 bg-white dark:bg-slate-700" />
              {/*
              <select value={activeStatus} onChange={(e) => setActiveStatus(Number(e.target.value))} className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-slate-700">
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              */}
              <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
              <button
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded ml-2"
                onClick={() => { setName(''); setUsername(''); setPassword(''); setRole(''); setMobile(''); setActiveStatus(1); setEditIndex(null); }}
              >
                Reset
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 overflow-auto">
              <h2 className="text-base font-semibold mb-3">Admin Users List</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 pr-2">S.No</th>
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Username</th>
                      <th className="py-2 pr-2">Password</th>
                      <th className="py-2 pr-2">Role</th>
                      <th className="py-2 pr-2">Mobile</th>
                      {/*<th className="py-2 pr-2">Active</th>*/}
                      <th className="py-2 pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-slate-500">No records found</td>
                      </tr>
                    ) : (
                      users
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((user, index) => (
                          <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700">
                            <td className="py-2 pr-2">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="py-2 pr-2">{user.name}</td>
                            <td className="py-2 pr-2">{user.username}</td>
                            <td className="py-2 pr-2">{user.password}</td>
                            <td className="py-2 pr-2">{user.role}</td>
                            <td className="py-2 pr-2">{user.mobile_number}</td>
                            {/*<td className="py-2 pr-2">{user.active_status === 1 ? "Yes" : "No"}</td>*/}
                            <td className="py-2 pr-2">
                              <div className="flex items-center gap-3">
                                <FiEdit
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    setName(user.name);
                                    setUsername(user.username);
                                    setPassword(user.password); 
                                    setRole(user.role);
                                    setMobile(user.mobile_number);
                                    setActiveStatus(user.active_status);
                                    setEditIndex((currentPage - 1) * pageSize + index);
                                    setPassword("");
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
              {users.length > pageSize && (
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    className="px-3 py-1 rounded border bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  {getPageNumbers(Math.ceil(users.length / pageSize), currentPage).map((p, i) => (
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
                    disabled={currentPage === Math.ceil(users.length / pageSize)}
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(users.length / pageSize), p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </Layout>

      {isThemeSettingsOpen && (
        <ThemeSettings onClose={() => setIsThemeSettingsOpen(false)} darkMode={darkMode} setDarkMode={setDarkMode} sidebarColor={sidebarColor} setSidebarColor={setSidebarColor} />
      )}
    </>
  );
};

export default User;
