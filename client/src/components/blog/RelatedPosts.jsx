import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function getImageUrl(img) {
  if (!img) return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80';
  if (img.startsWith('http')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

export default function RelatedPosts({ posts = [] }) {
  if (!posts.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={`/blog/${post.slug}`} className="group block card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={getImageUrl(post.coverImage)}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80'; }}
                />
              </div>
              <div className="p-4">
                <span className="badge-primary text-xs mb-2 inline-block">{post.category}</span>
                <h3 className="font-display font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
