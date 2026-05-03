import BlogCard from './BlogCard';
import { SkeletonCard } from '../common/SkeletonCard';

export default function MasonryGrid({ blogs, loading, lastItemRef }) {
  const skeletons = Array.from({ length: 8 });

  return (
    <div className="masonry">
      {loading && blogs.length === 0
        ? skeletons.map((_, i) => <SkeletonCard key={i} tall={i % 3 === 0} />)
        : blogs.map((blog, i) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              index={i}
              innerRef={i === blogs.length - 1 ? lastItemRef : undefined}
            />
          ))
      }
      {/* Loading more skeletons at bottom */}
      {loading && blogs.length > 0 &&
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)
      }
    </div>
  );
}
