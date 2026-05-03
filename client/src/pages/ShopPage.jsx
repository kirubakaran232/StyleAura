import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/api';

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('All');

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => getProducts({ limit: 100 }).then(res => res.data.products),
  });

  const filteredProducts = allProducts?.filter(product => {
    if (activeTab === 'All') return true;
    return product.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <>
      <Helmet>
        <title>Shop Fashion & Beauty - StyleAura</title>
        <meta name="description" content="Shop our curated collection of fashion and beauty affiliate products." />
      </Helmet>

      <section className="bg-white dark:bg-neutral-950 py-16 md:py-20 border-b border-gray-100 dark:border-neutral-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">Curated Products</p>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
              >
                Shop
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 dark:text-gray-300 max-w-2xl text-lg leading-relaxed mb-8"
              >
                Browse our handpicked selection of clothing and cosmetics. We find the best deals so you don't have to.
              </motion.p>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Fashion', 'Beauty'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-900 dark:text-gray-400 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card-hover bg-gray-900"
            >
              <img src="/shop.png" alt="Shop Collection" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section container-custom min-h-[50vh]">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : filteredProducts?.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {filteredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-semibold">No products found in this category.</p>
          </div>
        )}
      </section>
    </>
  );
}
