import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiBookmark, FiEye } from 'react-icons/fi';
import { SiPinterest } from 'react-icons/si';
import { useBookmarks } from '../../context/BookmarkContext';
import { likeBlog } from '../../services/api';

function getImageUrl(img) {
  if (!img) return '/placeholder.jpg';
  if (img.startsWith('http')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

export default function BlogCard({ blog, index = 0, innerRef }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [likes, setLikes] = useState(blog.likes || 0);
  const [liked, setLiked] = useState(false);
  const [pinHover, setPinHover] = useState(false);

  const imageUrl = getImageUrl(blog.coverImage);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;
    try {
      const { data } = await likeBlog(blog._id);
      setLikes(data.likes);
      setLiked(true);
    } catch {}
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(blog);
  };

  const handlePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.origin + '/blog/' + blog.slug)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(blog.title)}`;
    window.open(pinUrl, '_blank', 'width=750,height=550');
  };

  return (
    <motion.div
      ref={innerRef}
      className="masonry-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
    >
      <Link to={`/blog/${blog.slug}`} className="block group">
        <div className="card-hover relative overflow-hidden">
          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: index % 3 === 0 ? '2/3' : index % 2 === 0 ? '4/5' : '3/4' }}
            onMouseEnter={() => setPinHover(true)}
            onMouseLeave={() => setPinHover(false)}
          >
            <img
              src={imageUrl}
              alt={blog.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={e => { e.target.src = '/placeholder.jpg'; }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Pin It button on hover */}
            <motion.button
              onClick={handlePin}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: pinHover ? 1 : 0, scale: pinHover ? 1 : 0.8 }}
              className="absolute top-3 left-3 bg-pinterest text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
            >
              <SiPinterest size={12} /> Save
            </motion.button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center shadow-lg
                         opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <FiBookmark
                size={14}
                className={isBookmarked(blog._id) ? 'text-primary-500 fill-primary-500' : 'text-gray-600'}
              />
            </button>

            {/* Category badge */}
            <div className="absolute bottom-3 left-3">
              <span className="badge-primary text-xs shadow-sm">{blog.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-3">{blog.excerpt}</p>
            )}

            {/* Footer stats */}
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 transition-colors hover:text-orange-500 ${liked ? 'text-orange-500' : ''}`}
                >
                  <FiHeart size={13} className={liked ? 'fill-orange-500' : ''} />
                  {likes}
                </button>
                <span className="flex items-center gap-1">
                  <FiEye size={13} /> {blog.views || 0}
                </span>
              </div>
              <time className="text-xs">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </time>
            </div>

            <div className="mt-auto pt-2">
              <span className="btn-outline w-full text-sm py-2.5 flex items-center justify-center">
                View Outfit
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
