import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MasonryGrid from '../components/blog/MasonryGrid';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getBlogs } from '../services/api';
import SearchBar from '../components/common/SearchBar';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const fetchSearchBlogs = useCallback(async (page) => {
    if (!query) return { items: [], hasMore: false };
    const { data } = await getBlogs({ page, limit: 12, search: query });
    return { items: data.blogs, hasMore: data.pagination.hasMore };
  }, [query]);

  const { items: blogs, loading, lastItemRef, reset } = useInfiniteScroll(fetchSearchBlogs, [query]);

  // Handle case where query is cleared manually
  useEffect(() => {
    if (!query) reset();
  }, [query, reset]);

  return (
    <>
      <Helmet>
        <title>Search results for "{query}" - StyleAura</title>
      </Helmet>

      <section className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 py-12">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-6">
            Search results for <span className="text-gray-900 dark:text-white font-bold">"{query}"</span>
          </h1>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="section container-custom min-h-[50vh]">
        {!query ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold">Type to search</p>
          </div>
        ) : (
          <MasonryGrid blogs={blogs} loading={loading} lastItemRef={lastItemRef} />
        )}

        {!loading && query && blogs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🤷</p>
            <p className="text-xl font-semibold">No results found</p>
            <p className="text-sm mt-2">Try different keywords or check spelling.</p>
          </div>
        )}
      </section>
    </>
  );
}
