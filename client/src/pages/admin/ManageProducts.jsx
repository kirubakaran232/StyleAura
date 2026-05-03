import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import Sidebar from '../../components/admin/Sidebar';
import ProductForm from '../../components/admin/ProductForm';
import { getAdminProducts, deleteProduct } from '../../services/api';
import { SkeletonRow } from '../../components/common/SkeletonCard';
import toast from 'react-hot-toast';

export default function ManageProducts() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getAdminProducts().then(res => res.data.products)
  });

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries(['admin-products']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMut.mutate(id);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
    queryClient.invalidateQueries(['admin-products']);
  };

  return (
    <>
      <Helmet><title>Manage Products - StyleAura Admin</title></Helmet>
      <Sidebar />

      <main className="pl-64 min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Affiliate Products</h1>
              <p className="text-gray-500">Manage products, affiliate links, and tracked clicks.</p>
            </div>
            {!isFormOpen && (
              <button onClick={() => setIsFormOpen(true)} className="btn-primary">
                <FiPlus /> Add Product
              </button>
            )}
          </div>

          {isFormOpen ? (
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <ProductForm 
                product={editingProduct} 
                onSuccess={closeForm} 
                onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }} 
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
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Clicks</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover bg-white" />
                              <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                <p className="font-medium text-sm truncate">{product.name}</p>
                                {product.price && <p className="text-xs font-semibold text-primary-500">{product.price}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="p-4"><span className="badge bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300">{product.category}</span></td>
                          <td className="p-4">
                            <div className="flex flex-col items-start gap-1">
                              {product.isActive 
                                ? <span className="badge bg-primary-100 text-primary-700">Active</span>
                                : <span className="badge bg-gray-100 text-gray-600">Inactive</span>
                              }
                              {product.isTrending && <span className="badge bg-orange-100 text-orange-700">Trending</span>}
                            </div>
                          </td>
                          <td className="p-4 text-sm font-medium text-primary-500">{product.clicks || 0}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <a href={`/product/${product.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-primary-500 transition-colors" title="View live">
                                <FiExternalLink />
                              </a>
                              <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                                <FiEdit2 />
                              </button>
                              <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">No products found. Add one!</td>
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
