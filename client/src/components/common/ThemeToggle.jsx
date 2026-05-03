import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center
                 hover:bg-primary-100 dark:hover:bg-primary-950 transition-colors duration-200"
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        {isDark
          ? <FiSun size={16} className="text-rose-400" />
          : <FiMoon size={16} className="text-gray-600" />
        }
      </motion.div>
    </button>
  );
}
