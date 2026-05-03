import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import StatsCard from '../../components/admin/StatsCard';
import { getAnalytics } from '../../services/api';
import { FiFileText, FiPackage, FiUsers, FiMousePointer } from 'react-icons/fi';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => getAnalytics(),
    select: d => d.data
  });

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - StyleAura</title>
      </Helmet>

      <Sidebar />

      <main className="pl-64 min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
            <p className="text-gray-500">Welcome to your blog's command center.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-6 h-32 skeleton" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard 
                  label="Total Posts" 
                  value={data?.stats?.totalBlogs || 0} 
                  icon={<FiFileText />} 
                  color="primary"
                />
                <StatsCard 
                  label="Active Products" 
                  value={data?.stats?.totalProducts || 0} 
                  icon={<FiPackage />} 
                  color="emerald"
                />
                <StatsCard 
                  label="Affiliate Clicks" 
                  value={data?.stats?.totalProductClicks || 0} 
                  icon={<FiMousePointer />} 
                  color="amber"
                />
                <StatsCard 
                  label="Subscribers" 
                  value={data?.stats?.totalSubscribers || 0} 
                  icon={<FiUsers />} 
                  color="sky"
                />
              </div>

              {/* Top Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Top Posts */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg">Most Viewed Posts</h2>
                    <Link to="/admin/blogs" className="text-sm text-primary-600 hover:underline">View All</Link>
                  </div>
                  <div className="space-y-4">
                    {data?.topBlogs?.map((blog, i) => (
                      <div key={blog._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                          <img src={blog.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{blog.title}</p>
                          <p className="text-xs text-gray-500">{blog.views} views</p>
                        </div>
                        <div className="text-sm font-bold text-gray-400">#{i + 1}</div>
                      </div>
                    ))}
                    {!data?.topBlogs?.length && <p className="text-sm text-gray-500 text-center py-4">No posts yet</p>}
                  </div>
                </div>

                {/* Top Products */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg">Top Performing Products</h2>
                    <Link to="/admin/products" className="text-sm text-primary-600 hover:underline">View All</Link>
                  </div>
                  <div className="space-y-4">
                    {data?.topProducts?.map((product, i) => (
                      <div key={product._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                          <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-primary-500 font-medium">{product.clicks} clicks</p>
                        </div>
                        <div className="text-sm font-bold text-gray-400">#{i + 1}</div>
                      </div>
                    ))}
                    {!data?.topProducts?.length && <p className="text-sm text-gray-500 text-center py-4">No products yet</p>}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
