import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function ProsCons({ pros = [], cons = [] }) {
  if (!pros.length && !cons.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {/* Pros */}
      {pros.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-2xl p-5"
        >
          <h4 className="font-bold text-primary-700 dark:text-primary-400 mb-3 flex items-center gap-2">
            <FiCheckCircle size={18} /> Pros
          </h4>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-primary-800 dark:text-primary-300">
                <FiCheckCircle size={14} className="mt-0.5 flex-shrink-0 text-primary-500" />
                {pro}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Cons */}
      {cons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-5"
        >
          <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
            <FiXCircle size={18} /> Cons
          </h4>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300">
                <FiXCircle size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
                {con}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
