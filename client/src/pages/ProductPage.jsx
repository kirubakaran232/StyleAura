import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiChevronRight, FiStar } from 'react-icons/fi';
import { getProduct } from '../services/api';
import ImageGallery from '../components/product/ImageGallery';
import ProsCons from '../components/product/ProsCons';
import AffiliateButton from '../components/product/AffiliateButton';

export default function ProductPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
    select: d => d.data.product,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="container-custom py-24 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 dark:bg-neutral-800 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 w-32 rounded" />
            <div className="h-10 bg-gray-200 w-full rounded" />
            <div className="h-32 bg-gray-200 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  const imageUrl = data.images?.[0]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80';

  return (
    <>
      <Helmet>
        <title>{data.metaTitle || data.name} - StyleAura</title>
        <meta name="description" content={data.metaDescription || data.description.substring(0, 160)} />
        <meta property="og:title" content={data.metaTitle || data.name} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      <div className="container-custom py-12 md:py-24">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <FiChevronRight size={14} />
          <Link to={`/category/${data.category.toLowerCase()}`} className="hover:text-primary-600">{data.category}</Link>
          <FiChevronRight size={14} />
          <span className="text-gray-900 dark:text-gray-300 truncate">{data.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery images={data.images} />
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {data.isTrending && (
              <span className="badge bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 w-max mb-4">
                Trending Product
              </span>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {data.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {data.price && (
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {data.price}
                </span>
              )}
              {data.rating > 0 && (
                <div className="flex items-center gap-2 text-rose-500">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={i < Math.round(data.rating) ? 'fill-current' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">({data.rating})</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-line">
              {data.description}
            </div>

            <ProsCons pros={data.pros} cons={data.cons} />

            {/* CTA */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800">
              <p className="text-sm text-gray-500 mb-4 text-center">
                We may earn a commission if you purchase through this link, at no extra cost to you.
              </p>
              <AffiliateButton 
                productId={data._id} 
                affiliateLink={data.affiliateLink} 
                size="lg" 
                label="Check Current Price" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
