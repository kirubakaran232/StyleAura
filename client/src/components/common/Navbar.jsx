import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBookmark, FiMenu, FiX, FiLock } from 'react-icons/fi';
import { SiPinterest, SiInstagram } from 'react-icons/si';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Outfits", to: "/outfits" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navLinkClass = 'btn-ghost text-sm py-2 px-3';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg shadow-lg border-b border-gray-100 dark:border-neutral-800'
            : 'bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img src="/sa_logo.png" alt="StyleAura" className="w-9 h-9 rounded-xl object-cover group-hover:scale-110 transition-transform duration-200" />
              <span className="font-display font-bold text-xl gradient-text hidden sm:block">StyleAura</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link key={link.label} to={link.to} className={navLinkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(p => !p)}
                className="btn-ghost p-2.5 rounded-xl"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
              <Link to="/bookmarks" className="btn-ghost p-2.5 rounded-xl hidden sm:flex" aria-label="Saved posts">
                <FiBookmark size={18} />
              </Link>
              <a
                href="https://in.pinterest.com/jkstyleaura/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="btn-ghost p-2.5 rounded-xl hidden md:flex hover:text-[#E60023] transition-colors"
              >
                <SiPinterest size={17} />
              </a>
              <a
                href="https://www.instagram.com/jkstyleaura/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="btn-ghost p-2.5 rounded-xl hidden md:flex hover:text-orange-500 transition-colors"
              >
                <SiInstagram size={17} />
              </a>
              {/* <Link to="/admin/login" className="btn-outline text-sm py-2 px-3 hidden xl:flex">
                <FiLock size={15} /> Admin
              </Link> */}
              {/* <ThemeToggle /> */}
              <button
                className="lg:hidden btn-ghost p-2.5 rounded-xl"
                onClick={() => setMobileOpen(p => !p)}
                aria-label="Menu"
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 dark:border-neutral-800"
            >
              <div className="container-custom py-4">
                <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-neutral-900 z-40 shadow-2xl pt-20 flex flex-col"
          >
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map(link => (
                <Link key={link.label} to={link.to} className="sidebar-link text-base">
                  {link.label}
                </Link>
              ))}
              <Link to="/bookmarks" className="sidebar-link text-base">Saved</Link>
              <Link to="/admin/login" className="sidebar-link text-base">Admin Login</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
}
