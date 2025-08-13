import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiClock, FiLayers, FiBook, FiUser, FiUserCheck } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  color?: 'blue' | 'cyan' | 'indigo' | 'violet' | 'rose' | 'emerald' | 'slate';
  onClose?: () => void;
}

type Palette = {
  panelBg: string;
  headerBg: string;
  active: string;
  link: string;
  hover: string;
};

const colorToClasses: Record<NonNullable<SidebarProps['color']>, Palette> = {
  blue:    { panelBg: 'bg-blue-900',   headerBg: 'bg-blue-800',   active: 'bg-blue-700 text-white',   link: 'text-white',                          hover: 'hover:bg-white/10' },
  cyan:    { panelBg: 'bg-white dark:bg-slate-800', headerBg: 'bg-cyan-700',    active: 'bg-cyan-600 text-white',    link: 'text-slate-800 dark:text-slate-100', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  indigo:  { panelBg: 'bg-white dark:bg-slate-800', headerBg: 'bg-indigo-700',  active: 'bg-indigo-600 text-white',  link: 'text-slate-800 dark:text-slate-100', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  violet:  { panelBg: 'bg-white dark:bg-slate-800', headerBg: 'bg-violet-700',  active: 'bg-violet-600 text-white',  link: 'text-slate-800 dark:text-slate-100', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  rose:    { panelBg: 'bg-white dark:bg-slate-800', headerBg: 'bg-rose-700',    active: 'bg-rose-600 text-white',    link: 'text-slate-800 dark:text-slate-100', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  emerald: { panelBg: 'bg-white dark:bg-slate-800', headerBg: 'bg-emerald-700', active: 'bg-emerald-600 text-white', link: 'text-slate-800 dark:text-slate-100', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
  slate:   { panelBg: 'bg-white dark:bg-slate-800', headerBg: 'bg-slate-700',   active: 'bg-slate-700 text-white',   link: 'text-slate-800 dark:text-slate-100', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, color = 'blue', onClose }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/Home' },
    { name: 'Action Pending', icon: <FiClock />, path: '/action-pending' },
    { name: 'Departments', icon: <FiLayers />, path: '/departments' },
    { name: 'User', icon: <FiBook />, path: '/user' },
    { name: 'Subjects', icon: <FiBook />, path: '/subjects' },
    { name: 'Caste', icon: <FiLayers />, path: '/caste' },
    { name: 'Teachers', icon: <FiUser />, path: '/teachers' },
    { name: 'Students', icon: <FiUserCheck />, path: '/students' },
    { name: 'Academics', icon: <FiUserCheck />, path: '/Academics' },
    { name: 'Board', icon: <FiUserCheck />, path: '/Board' },
  ];

  const palette = colorToClasses[color];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => onClose?.()}
          aria-hidden="true"
        />
      )}

      <aside
        className={
          `fixed inset-y-0 left-0 ${palette.panelBg} shadow z-50 transition-all duration-300 flex flex-col ` +
          // width: on mobile always full sidebar width; on md collapse/expand
          `w-[240px] ` + (isOpen ? 'translate-x-0' : '-translate-x-full') + ' md:translate-x-0 ' +
          (isOpen ? 'md:w-[240px]' : 'md:w-[70px]')
        }
      >
        <h2 className={`text-center font-semibold text-white ${palette.headerBg} py-3`}>{isOpen ? 'Klartopedia' : 'K'}</h2>
        <ul className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item, index) => (
            <li key={index} className="px-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded ${palette.hover} ` +
                  `${isActive ? palette.active : palette.link} ` +
                  `${!isOpen ? 'md:justify-center' : ''}`
                }
                title={!isOpen ? item.name : ''}
                onClick={() => onClose?.()} // close on mobile after navigation
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`truncate ${!isOpen ? 'md:hidden' : ''}`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;