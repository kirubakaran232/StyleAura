import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function getImageUrl(img) {
  if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
  if (img.startsWith('http')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);

  const imgs = images.length > 0 ? images : [{ url: '' }];
  const activeUrl = getImageUrl(imgs[active]?.url);

  const prev = () => setActive(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setActive(i => (i + 1) % imgs.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800" style={{ aspectRatio: '4/3' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={activeUrl}
            alt={`Product image ${active + 1}`}
            loading="lazy"
            className="w-full h-full object-contain bg-white dark:bg-neutral-900 p-2"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'; }}
          />
        </AnimatePresence>

        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90
                         flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90
                         flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots */}
        {imgs.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white w-5' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white dark:bg-neutral-900
                          ${i === active ? 'border-primary-500 shadow-glow' : 'border-gray-200 dark:border-neutral-700 opacity-60 hover:opacity-100'}`}
            >
              <img
                src={getImageUrl(img.url)}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-contain p-1"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
