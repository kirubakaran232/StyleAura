import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import Sidebar from '../../components/admin/Sidebar';
import BlogForm from '../../components/admin/BlogForm';
import { getAdminBlogs, deleteBlog } from '../../services/api';
import { SkeletonRow } from '../../components/common/SkeletonCard';
import toast from 'react-hot-toast';

function getImageUrl(img) {
  if (!img) return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100';
  if (img.startsWith('http')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

export default function ManageBlogs() {
  const [editingBlog, setEditingBlog] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => getAdminBlogs().then(res => res.data.blogs)
  });

  const deleteMut = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted');
      queryClient.invalidateQueries(['admin-blogs']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMut.mutate(id);
    }
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingBlog(null);
    setIsFormOpen(false);
    queryClient.invalidateQueries(['admin-blogs']);
  };

  return (
    <>
      <Helmet><title>Manage Blogs - StyleAura Admin</title></Helmet>
      <Sidebar />

      <main className="pl-64 min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
              <p className="text-gray-500">Manage your articles, guides, and stories.</p>
            </div>
            {!isFormOpen && (
              <button onClick={() => setIsFormOpen(true)} className="btn-primary">
                <FiPlus /> New Post
              </button>
            )}
          </div>

          {isFormOpen ? (
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">{editingBlog ? 'Edit Post' : 'Create New Post'}</h2>
              <BlogForm 
                blog={editingBlog} 
                onSuccess={closeForm} 
                onCancel={() => { setIsFormOpen(false); setEditingBlog(null); }} 
              />
            </div>
          ) : (
            <div className="card overflow-hidden">
              {isLoading ? (
                <div>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 text-sm text-gray-500">
                        <th className="p-4 font-medium">Post</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Views</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(blog => (
                        <tr key={blog._id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={getImageUrl(blog.coverImage)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                <p className="font-medium text-sm truncate">{blog.title}</p>
                                <p className="text-xs text-gray-500 truncate">{new Date(blog.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4"><span className="badge bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300">{blog.category}</span></td>
                          <td className="p-4">
                            {blog.isPublished 
                              ? <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">Published</span>
                              : <span className="badge bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300">Draft</span>
                            }
                          </td>
                          <td className="p-4 text-sm text-gray-600">{blog.views || 0}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-primary-500 transition-colors" title="View live">
                                <FiExternalLink />
                              </a>
                              <button onClick={() => openEdit(blog)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                                <FiEdit2 />
                              </button>
                              <button onClick={() => handleDelete(blog._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {blogs.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">No blog posts found. Create one!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
