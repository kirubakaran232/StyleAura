import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiArrowRight, FiSearch, FiCheckCircle, FiHeart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MasonryGrid from '../components/blog/MasonryGrid';
import CategoryFilter from '../components/blog/CategoryFilter';
import ProductCard from '../components/product/ProductCard';
import NewsletterSignup from '../components/common/NewsletterSignup';
import { SkeletonProductCard } from '../components/common/SkeletonCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';
import { getBlogs, getProducts } from '../services/api';
import { useQuery } from '@tanstack/react-query';

const HERO_BG = '/hero-bg.svg';
const STYLE_BOARDS = [
  {
    key: "daily",
    label: "Daily Glow",
    title: (
      <>
        Polished <br /> everyday style
      </>
    ),
    image: "/home1.png",
    notes: [
      "Relaxed shirt or knit top",
      "Clean base makeup",
      "Soft lipstick shade",
    ],
    to: "/category/fashion",
  },
  {
    key: "party",
    label: "Party Ready",
    title: "A sharper evening look",
    image:
      "/home2.png",
    notes: [
      "Statement dress or co-ord",
      "Defined eye makeup",
      "Long-wear lip color",
    ],
    to: "/category/fashion",
  },
  {
    key: "skincare",
    label: "Skin First",
    title: "Simple skincare routine",
    image:
      "/home3.png",
    notes: ["Gentle cleanser", "Lightweight moisturizer", "Daily sunscreen"],
    to: "/category/beauty",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [activeBoard, setActiveBoard] = useState(STYLE_BOARDS[0]);
  const debouncedSearch = useDebounce(search, 400);

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => getProducts({ trending: true, limit: 6 }),
    select: d => d.data.products,
  });

  const fetchBlogs = useCallback(async (page) => {
    const params = { page, limit: 12 };
    if (activeCategory !== 'All') params.category = activeCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    const { data } = await getBlogs(params);
    return { items: data.blogs, hasMore: data.pagination.hasMore };
  }, [activeCategory, debouncedSearch]);

  const { items: blogs, loading: blogsLoading, lastItemRef } = useInfiniteScroll(
    fetchBlogs,
    [activeCategory, debouncedSearch]
  );

  return (
    <>
      <Helmet>
        <title>StyleAura - Clothing & Cosmetics Blog</title>
        <meta name="description" content="StyleAura shares clothing ideas, cosmetics recommendations, skincare basics, makeup tips, and budget-friendly style inspiration." />
        <meta property="og:title" content="StyleAura - Clothing & Cosmetics Blog" />
        <meta property="og:description" content="Discover outfit ideas, cosmetics picks, skincare basics, and value-focused style inspiration." />
        <meta property="og:image" content={HERO_BG} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="relative min-h-[64vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="StyleAura clothing and cosmetics" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative container-custom text-white z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-sm font-medium mb-6">
              Clothing and cosmetics inspiration
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Welcome to<br />
              <span className="text-rose-200">StyleAura</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl">
              StyleAura helps you discover the best clothing styles, skincare essentials, makeup tips, and trending cosmetics that fit your lifestyle and budget.
            </p>

            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-2 max-w-xl mx-auto">
              <FiSearch size={20} className="ml-3 text-white/70 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search outfits, cosmetics, posts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/60 focus:outline-none py-2"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to="/category/fashion" className="btn bg-white text-primary-700 hover:bg-gray-100 shadow-lg">
                Fashion
              </Link>
              <Link to="/category/beauty" className="btn bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30">
                Beauty
              </Link>
              <Link to="/about" className="btn bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30">
                About StyleAura
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">Daily ideas</p>
                <p className="font-semibold text-white mt-1">Outfits for every mood</p>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">Beauty picks</p>
                <p className="font-semibold text-white mt-1">Skincare + makeup edits</p>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">Handpicked</p>
                <p className="font-semibold text-white mt-1">Practical product lists</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50 dark:fill-neutral-950">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <section className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-card"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-3">
              <FiCheckCircle size={18} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-gray-900 dark:text-white">Simple Style Guides</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Clear ideas for daily outfits, party looks, and easy pairings.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-card"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 flex items-center justify-center mb-3">
              <FiHeart size={18} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-gray-900 dark:text-white">Beauty That Works</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Makeup and skincare recommendations selected for real-world use.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-card"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-3">
              <FiStar size={18} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-gray-900 dark:text-white">Curated Picks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Trending products and useful posts, all in one clean feed.</p>
          </motion.div>
        </div>
      </section>

      <section className="container-custom pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 items-stretch">
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-2">
              <FiHeart size={16} /> Interactive Style Board
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pick a mood, then build the look
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Tap a style mood to switch the board. Each edit combines clothing direction with cosmetics or skincare details, so the inspiration feels complete.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {STYLE_BOARDS.map(board => (
                <button
                  key={board.key}
                  onClick={() => setActiveBoard(board)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    activeBoard.key === board.key
                      ? 'bg-primary-500 text-white border-primary-500 shadow-glow'
                      : 'bg-white dark:bg-neutral-950 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {board.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBoard.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {activeBoard.notes.map(note => (
                  <div key={note} className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 p-3">
                    <FiCheckCircle className="text-primary-500 flex-shrink-0" size={18} />
                    <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{note}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeBoard.key}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative min-h-[460px] rounded-2xl overflow-hidden shadow-card-hover bg-gray-900"
            >
              <img src={activeBoard.image} alt={activeBoard.title} className="absolute inset-0 w-full h-full object-cover" />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-700/35 to-transparent" /> */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <p className="text-white/70 text-sm font-semibold mb-2">{activeBoard.label}</p>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">{activeBoard.title}</h3>
                <Link to={activeBoard.to} className="btn bg-white text-primary-700 hover:bg-gray-100 shadow-lg">
                  Explore this edit <FiArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="section container-custom pt-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-1">
              <FiTrendingUp size={16} /> Trending Now
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Trending Picks</h2>
          </div>
          <a href="#latest-posts" className="btn-outline hidden sm:flex">
            Latest Posts <FiArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonProductCard key={i} />)
            : (trendingData || []).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))
          }
        </div>
      </section>

      <section id="latest-posts" className="section container-custom">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Latest Posts
          </h2>
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + debouncedSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MasonryGrid blogs={blogs} loading={blogsLoading} lastItemRef={lastItemRef} />
          </motion.div>
        </AnimatePresence>

        {!blogsLoading && blogs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-semibold">No posts found</p>
            <p className="text-sm mt-2">Try a different category or search term</p>
          </div>
        )}
      </section>

      <section className="section container-custom">
        <NewsletterSignup />
      </section>
    </>
  );
}
