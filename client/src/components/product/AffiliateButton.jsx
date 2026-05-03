import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiExternalLink } from 'react-icons/fi';
import { trackClick } from '../../services/api';

export default function AffiliateButton({ productId, affiliateLink, size = 'lg', label = 'Check Current Price' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await trackClick(productId);
    } catch {}
    setTimeout(() => {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
      setLoading(false);
    }, 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`btn-amazon relative overflow-hidden ${size === 'lg' ? 'btn-lg w-full' : 'btn w-full'} disabled:opacity-70`}
    >
      {/* Shimmer animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear', repeatDelay: 1 }}
      />
      <FiShoppingCart size={size === 'lg' ? 20 : 16} />
      <span className="font-bold">
        {loading ? 'Redirecting...' : label}
      </span>
      <FiExternalLink size={14} className="opacity-70" />
    </motion.button>
  );
}
