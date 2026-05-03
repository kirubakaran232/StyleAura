import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import MasonryGrid from '../components/blog/MasonryGrid';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getBlogs } from '../services/api';

export default function OutfitsPage() {
  const fetchBlogs = useCallback(async (page) => {
    const { data } = await getBlogs({ page, limit: 12 });
    return { items: data.blogs, hasMore: data.pagination.hasMore };
  }, []);

  const { items: blogs, loading, lastItemRef } = useInfiniteScroll(fetchBlogs, []);

  return (
    <>
      <Helmet>
        <title>Outfits & Inspiration - StyleAura</title>
        <meta name="description" content="Discover outfit ideas, styling tips, and beauty inspiration on StyleAura." />
      </Helmet>

      <section className="bg-white dark:bg-neutral-950 py-16 md:py-20 border-b border-gray-100 dark:border-neutral-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">Blog & Inspiration</p>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
              >
                Outfits
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 dark:text-gray-300 max-w-2xl text-lg leading-relaxed mb-6"
              >
                Explore our latest outfit ideas, wardrobe guides, and beauty routines to elevate your everyday style.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card-hover bg-gray-900"
            >
              <img src="/outfit.png" alt="Outfits Inspiration" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section container-custom min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MasonryGrid blogs={blogs} loading={loading} lastItemRef={lastItemRef} />
          </motion.div>
        </AnimatePresence>

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-semibold">No posts found.</p>
          </div>
        )}
      </section>
    </>
  );
}
