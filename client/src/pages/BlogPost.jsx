import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiClock, FiTwitter, FiFacebook, FiLink } from "react-icons/fi";
import { SiPinterest } from "react-icons/si";
import { getBlog, likeBlog } from "../services/api";
import ProductCard from "../components/product/ProductCard";
import ImageGallery from "../components/product/ImageGallery";
import toast from "react-hot-toast";

function getImageUrl(img) {
  if (!img)
    return "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80";
  if (img.startsWith("http")) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  return baseUrl + img;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getBlog(slug),
    select: (d) => d.data.blog,
    retry: false,
  });

  useEffect(() => {
    if (data) setLikes(data.likes || 0);
  }, [data]);

  if (isLoading) {
    return (
      <div className="container-custom py-24 animate-pulse">
        <div className="w-full h-96 bg-gray-200 dark:bg-neutral-800 rounded-3xl mb-12"></div>
        <div className="h-10 bg-gray-200 dark:bg-neutral-800 rounded-xl w-3/4 mb-6 mx-auto"></div>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container-custom py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-500 mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(data.coverImage);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const galleryImages = [
    ...(data.coverImage ? [{ url: data.coverImage }] : []),
    ...(data.images || []).map((u) => ({ url: u })),
  ];
  const hasFeaturedProducts = (data.featuredProducts || []).length > 0;

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await likeBlog(data._id);
      setLikes(res.data.likes);
      setLiked(true);
      toast.success("Thanks for liking!");
    } catch {}
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <Helmet>
        <title>{data.metaTitle || data.title} - StyleAura</title>
        <meta
          name="description"
          content={data.metaDescription || data.excerpt}
        />
        <meta property="og:title" content={data.metaTitle || data.title} />
        <meta
          property="og:description"
          content={data.metaDescription || data.excerpt}
        />
        <meta property="og:image" content={imageUrl} />
        <meta name="pinterest-rich-pin" content="true" />
      </Helmet>

      <article className="pb-24">
        <section className="container-custom pt-8 pb-8 md:pt-10 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <Link
              to={`/category/${data.category.toLowerCase()}`}
              className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50 mb-4"
            >
              {data.category}
            </Link>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight max-w-4xl mx-auto">
              {data.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
              <span className="flex items-center gap-2">
                <FiClock /> {new Date(data.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <FiEye /> {data.views} views
              </span>
            </div>
          </motion.div>
        </section>

        <div
          className={`container-custom mx-auto max-w-6xl grid grid-cols-1 ${
            hasFeaturedProducts ? "lg:grid-cols-[72px_minmax(0,1fr)_300px]" : "lg:grid-cols-[72px_minmax(0,1fr)]"
          } gap-8 xl:gap-10 relative`}
        >
          {/* Social Share Sidebar (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-3">
              <button
                onClick={handleLike}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${liked ? "bg-orange-100 text-orange-600 dark:bg-orange-900/50" : "bg-white text-gray-500 hover:text-orange-500 dark:bg-neutral-800"}`}
              >
                <FiHeart size={20} className={liked ? "fill-current" : ""} />
              </button>

              <div className="w-12 h-[1px] bg-gray-200 dark:bg-neutral-800 my-2 mx-auto" />

              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(data.pinterestDescription || data.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#E60023] text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
              >
                <SiPinterest size={20} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center shadow-lg hover:bg-sky-600 transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#4267B2] text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
              >
                <FiFacebook size={20} />
              </a>
              <button
                onClick={copyLink}
                className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400 flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors"
              >
                <FiLink size={20} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0">
            {/* Mobile Share */}
            <div className="lg:hidden flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-neutral-800">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${liked ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}
              >
                <FiHeart className={liked ? "fill-current" : ""} /> {likes}{" "}
                Likes
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[#E60023] bg-red-50 rounded-full"
                >
                  <SiPinterest size={18} />
                </a>
                <button
                  onClick={copyLink}
                  className="p-2 text-gray-500 bg-gray-100 rounded-full"
                >
                  <FiLink size={18} />
                </button>
              </div>
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-card p-5 md:p-6">
                <h3 className="font-display font-bold text-xl mb-4">Post Images</h3>
                <ImageGallery images={galleryImages} />
              </div>
            )}

            {/* Prose Content */}
            <div className="mt-10 rounded-3xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-card p-6 md:p-8 lg:p-10">
              <div
                className="prose-content text-lg"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                <span className="text-gray-500 mr-2 font-medium">Tags:</span>
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Products Sidebar */}
          {hasFeaturedProducts && (
            <aside className="w-full space-y-6">
              <h3 className="font-display font-bold text-xl mb-1">
                Featured in this post
              </h3>
              <div className="space-y-6 sticky top-28">
                {data.featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </aside>
          )}
        </div>

        {/* Related Posts */}
        <div className="container-custom">
          {/* We would fetch related posts here based on category. For now, mock or leave empty depending on API */}
          {/* <RelatedPosts posts={[]} /> */}
        </div>
      </article>
    </>
  );
}
