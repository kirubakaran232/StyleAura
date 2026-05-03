import { useState, useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(fetchFn, deps = []) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    reset();
  }, deps); // eslint-disable-line

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!hasMore) return;
      setLoading(true);
      try {
        const res = await fetchFn(page);
        if (!cancelled) {
          setItems(prev => page === 1 ? res.items : [...prev, ...res.items]);
          setHasMore(res.hasMore);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page]); // eslint-disable-line

  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return { items, loading, error, hasMore, lastItemRef, reset };
}
