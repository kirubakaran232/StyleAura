import { motion } from 'framer-motion';

const ALL_CATEGORIES = ['All', 'Fashion', 'Beauty'];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
      {ALL_CATEGORIES.map(cat => (
        <motion.button
          key={cat}
          onClick={() => onChange(cat)}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                      border transition-all duration-200 flex-shrink-0
                      ${active === cat
                        ? 'bg-primary-500 text-white border-primary-500 shadow-glow'
                        : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-700 hover:border-primary-300 hover:text-primary-600'
                      }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}
