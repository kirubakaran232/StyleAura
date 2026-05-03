import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiBookmark } from 'react-icons/fi';
import { trackClick } from '../../services/api';
import { useBookmarks } from '../../context/BookmarkContext';

function getImageUrl(img) {
  if (!img) return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80';
  if (img.startsWith('http')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

export default function ProductCard({ product, index = 0, innerRef }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [clicking, setClicking] = useState(false);

  const imageUrl = product.images?.[0]?.url
    ? getImageUrl(product.images[0].url)
    : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80';

  const handleAffiliateClick = async (e) => {
    e.preventDefault();
    setClicking(true);
    try {
      await trackClick(product._id);
    } catch {}
    setTimeout(() => {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
      setClicking(false);
    }, 200);
  };

  const stars = Math.round(product.rating || 0);

  return (
    <motion.div
      ref={innerRef}
      className="card-hover group flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative overflow-hidden block">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80'; }}
          />
        </div>

        {product.isTrending && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary-600 to-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full">
            Trending
          </div>
        )}

        <button
          onClick={e => { e.preventDefault(); toggleBookmark(product); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
        >
          <FiBookmark
            size={14}
            className={isBookmarked(product._id) ? 'text-primary-500 fill-primary-500' : 'text-gray-600'}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="badge-primary text-xs mb-2 self-start">{product.category}</span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors mb-1 text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={12}
                className={i < stars ? 'text-rose-400 fill-rose-400' : 'text-gray-300 dark:text-neutral-600'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
          </div>
        )}

        {product.price && (
          <p className="text-primary-600 dark:text-primary-400 font-bold text-sm mb-3">{product.price}</p>
        )}

        <div className="mt-auto pt-2">
          <motion.button
            onClick={handleAffiliateClick}
            whileTap={{ scale: 0.97 }}
            disabled={clicking}
            className="btn-amazon w-full text-sm py-2.5 disabled:opacity-70"
          >
            <FiShoppingCart size={14} />
            {clicking ? 'Opening...' : 'Check Current Price'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
