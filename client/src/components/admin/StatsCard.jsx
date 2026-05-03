import { motion } from 'framer-motion';

export default function StatsCard({ label, value, icon, color = 'primary', change }) {
  const colors = {
    primary: 'from-primary-600 to-rose-400',
    amber:   'from-amber-400 to-orange-500',
    emerald: 'from-primary-400 to-rose-400',
    sky:     'from-sky-400 to-blue-500',
    rose:    'from-orange-400 to-rose-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg text-xl`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            change >= 0
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}
