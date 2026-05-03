import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiFileText, FiPackage, FiBarChart2,
  FiLogOut, FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const links = [
  { to: '/admin', icon: <FiHome size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/blogs', icon: <FiFileText size={18} />, label: 'Blog Posts' },
  { to: '/admin/products', icon: <FiPackage size={18} />, label: 'Products' },
  { to: '/admin/analytics', icon: <FiBarChart2 size={18} />, label: 'Analytics' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800
                      flex flex-col z-30 shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <img src="/sa_logo.png" alt="StyleAura" className="w-10 h-10 rounded-xl object-cover shadow-glow" />
          <div>
            <p className="font-display font-bold text-lg gradient-text leading-none">StyleAura</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email || 'Admin'}</p>
            <p className="text-xs text-primary-500">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600">
          <FiLogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
