import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBookmarks } from '../context/BookmarkContext';
import { FiTrash2 } from 'react-icons/fi';

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useBookmarks();

  return (
    <>
      <Helmet>
        <title>Saved Items - StyleAura</title>
      </Helmet>

      <section className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 py-12">
        <div className="container-custom">
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">Saved Items</h1>
          <p className="text-gray-500">Your personal collection of favorite posts and products.</p>
        </div>
      </section>

      <section className="section container-custom min-h-[50vh]">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-semibold">No saved items yet</p>
            <p className="text-sm mt-2 mb-6">Start exploring and save items for later.</p>
            <Link to="/" className="btn-primary">Explore Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bookmarks.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <Link to={`/${item.type}/${item.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden card-hover">
                  <img
                    src={item.coverImage || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <span className="badge bg-white/20 text-white backdrop-blur border border-white/30 text-[10px] w-max mb-1 uppercase tracking-wider">{item.type}</span>
                    <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
                  </div>
                </Link>
                <button
                  onClick={() => toggleBookmark(item)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Remove bookmark"
                >
                  <FiTrash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
