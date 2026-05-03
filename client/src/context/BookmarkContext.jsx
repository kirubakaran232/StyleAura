import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (item) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b._id === item._id);
      if (exists) {
        toast.success('Removed from bookmarks');
        return prev.filter(b => b._id !== item._id);
      } else {
        toast.success('Saved to bookmarks!');
        return [...prev, { _id: item._id, title: item.title || item.name, slug: item.slug, coverImage: item.coverImage || item.images?.[0]?.url, type: item.title ? 'blog' : 'product' }];
      }
    });
  };

  const isBookmarked = (id) => bookmarks.some(b => b._id === id);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
};
