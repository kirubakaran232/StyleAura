import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
  addBookmark,
  getBookmarks,
  getLikedBlogs,
  likeBlog,
  removeBookmark,
} from '../services/api';

const BookmarkContext = createContext();

function toBookmarkItem(item) {
  return {
    itemId: item._id || item.itemId,
    type: item.title ? 'blog' : 'product',
    title: item.title || item.name,
    slug: item.slug,
    coverImage: item.coverImage || item.images?.[0]?.url,
  };
}

function normalizeBookmark(item) {
  const id = item.itemId?._id || item.itemId || item._id;
  return {
    ...item,
    _id: id,
    itemId: id,
  };
}

export function BookmarkProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setBookmarks([]);
      setLikedBlogIds([]);
      return;
    }

    setLoading(true);
    Promise.all([getBookmarks(), getLikedBlogs()])
      .then(([bookmarksRes, likesRes]) => {
        setBookmarks((bookmarksRes.data.bookmarks || []).map(normalizeBookmark));
        setLikedBlogIds(likesRes.data.likedBlogs || []);
      })
      .catch(() => {
        toast.error('Could not load your saved items');
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const requireLogin = (message) => {
    if (user) return true;
    toast.error(message);
    navigate('/login');
    return false;
  };

  const toggleBookmark = async (item) => {
    if (!requireLogin('Please sign in to save items')) return;

    const bookmark = toBookmarkItem(item);
    const exists = bookmarks.some(b => b.itemId === bookmark.itemId);

    try {
      if (exists) {
        const { data } = await removeBookmark(bookmark.itemId);
        setBookmarks((data.bookmarks || []).map(normalizeBookmark));
        toast.success('Removed from saved items');
      } else {
        const { data } = await addBookmark(bookmark);
        setBookmarks((data.bookmarks || []).map(normalizeBookmark));
        toast.success('Saved to your account');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update saved items');
    }
  };

  const toggleLike = async (blogId) => {
    if (!requireLogin('Please sign in to like posts')) return null;

    try {
      const { data } = await likeBlog(blogId);
      setLikedBlogIds(prev => (
        data.liked
          ? [...new Set([...prev, blogId])]
          : prev.filter(id => id !== blogId)
      ));
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update like');
      return null;
    }
  };

  const isBookmarked = (id) => bookmarks.some(b => b.itemId === id);
  const isLiked = (id) => likedBlogIds.includes(id);

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      loading,
      toggleBookmark,
      isBookmarked,
      likedBlogIds,
      toggleLike,
      isLiked,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
};
