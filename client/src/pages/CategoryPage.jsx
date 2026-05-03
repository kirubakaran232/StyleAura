import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import MasonryGrid from '../components/blog/MasonryGrid';
import ProductCard from '../components/product/ProductCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getBlogs, getProducts } from '../services/api';

const CATEGORY_COPY = {
  fashion: {
    eyebrow: 'Clothing',
    description: 'Daily outfits, party looks, wardrobe ideas, and budget-friendly clothing inspiration from StyleAura.',
    image: '/fashion.png',
    chips: ['Daily wear', 'Party looks', 'Budget outfits'],
  },
  beauty: {
    eyebrow: 'Cosmetics',
    description: 'Makeup picks, skincare basics, lipstick guides, and cosmetics recommendations from StyleAura.',
    image: '/beauty.png',
    chips: ['Makeup', 'Skincare', 'Lipsticks'],
  },
};

export default function CategoryPage() {
  const { category } = useParams();
  const titleCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const copy = CATEGORY_COPY[category.toLowerCase()] || {
    eyebrow: 'StyleAura',
    description: `Discover clothing and cosmetics recommendations in our ${category} collection.`,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
    chips: ['StyleAura', 'Fashion', 'Beauty'],
  };

  const fetchCategoryBlogs = useCallback(async (page) => {
    const { data } = await getBlogs({ page, limit: 12, category: titleCategory });
    return { items: data.blogs, hasMore: data.pagination.hasMore };
  }, [titleCategory]);

  const { items: blogs, loading, lastItemRef } = useInfiniteScroll(fetchCategoryBlogs, [category]);

  const { data: productsData } = useQuery({
    queryKey: ['category-products', titleCategory],
    queryFn: () => getProducts({ category: titleCategory, limit: 12 }).then(res => res.data.products),
  });

  return (
    <>
      <Helmet>
        <title>{titleCategory} Articles & Products - StyleAura</title>
        <meta name="description" content={copy.description} />
      </Helmet>

      <section className="bg-white dark:bg-neutral-950 py-16 md:py-20 border-b border-gray-100 dark:border-neutral-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">{copy.eyebrow}</p>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
              >
                {titleCategory}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 dark:text-gray-300 max-w-2xl text-lg leading-relaxed mb-6"
              >
                {copy.description}
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {copy.chips.map(chip => (
                  <span key={chip} className="badge-primary">{chip}</span>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card-hover bg-gray-900"
            >
              <img src={copy.image} alt={`${titleCategory} inspiration`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {productsData && productsData.length > 0 && (
        <section className="section container-custom">
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {titleCategory} Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {productsData.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Blog Posts Section */}
      <section className="section container-custom min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MasonryGrid blogs={blogs} loading={loading} lastItemRef={lastItemRef} />
          </motion.div>
        </AnimatePresence>

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-semibold">No posts in this category yet</p>
          </div>
        )}
      </section>
    </>
  );
}
