import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createProduct, updateProduct } from '../../services/api';

const CATEGORIES = ['Fashion', 'Beauty'];

const EMPTY = {
  name: '', description: '', category: 'Fashion', affiliateLink: '',
  price: '', rating: 0, pros: '', cons: '', isActive: true, isTrending: false,
  metaTitle: '', metaDescription: '',
};

function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('blob')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

export default function ProductForm({ product, onSuccess, onCancel }) {
  const [form, setForm] = useState(product ? {
    ...product,
    pros: (product.pros || []).join('\n'),
    cons: (product.cons || []).join('\n'),
  } : EMPTY);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(
    product?.images?.map(i => getImageUrl(i.url) || '') || []
  );
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.affiliateLink) {
      return toast.error('Name, description, and affiliate link are required');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      // Skip server-managed / read-only fields — images are handled via file input
      const SKIP = new Set(['images', '_id', 'slug', 'clicks', 'createdAt', 'updatedAt', '__v']);
      Object.entries(form).forEach(([k, v]) => {
        if (SKIP.has(k)) return;
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      imageFiles.forEach(f => fd.append('images', f));

      if (product) {
        await updateProduct(product._id, fd);
        toast.success('Product updated!');
      } else {
        await createProduct(fd);
        toast.success('Product created!');
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="label">Product Name *</label>
          <input className="input" placeholder="Product name..." value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>

        {/* Category */}
        <div>
          <label className="label">Category *</label>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="label">Price (optional)</label>
          <input className="input" placeholder="$29.99" value={form.price} onChange={e => set('price', e.target.value)} />
        </div>

        {/* Affiliate Link */}
        <div className="md:col-span-2">
          <label className="label">Affiliate Link *</label>
          <input className="input" type="url" placeholder="https://example.com/product/XXXXX" value={form.affiliateLink} onChange={e => set('affiliateLink', e.target.value)} required />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="label">Description *</label>
          <textarea className="input resize-none h-28" placeholder="Product description..." value={form.description} onChange={e => set('description', e.target.value)} required />
        </div>

        {/* Pros */}
        <div>
          <label className="label">Pros (one per line)</label>
          <textarea className="input resize-none h-32" placeholder={"Great build quality\nExcellent value\nFast shipping"} value={form.pros} onChange={e => set('pros', e.target.value)} />
        </div>

        {/* Cons */}
        <div>
          <label className="label">Cons (one per line)</label>
          <textarea className="input resize-none h-32" placeholder={"Battery life could be better\nNo carrying case included"} value={form.cons} onChange={e => set('cons', e.target.value)} />
        </div>

        {/* Rating */}
        <div>
          <label className="label">Rating (0–5)</label>
          <input className="input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set('rating', parseFloat(e.target.value))} />
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="label">Product Images (up to 5)</label>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-2xl p-6 cursor-pointer
                       hover:border-primary-400 transition-colors"
          >
            {imagePreviews.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt={`img-${i}`} className="w-20 h-20 object-cover rounded-xl" />
                ))}
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-400 hover:border-primary-400">
                  <FiPlus size={20} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400">
                <FiUpload size={24} />
                <div>
                  <p className="font-medium">Click to upload images</p>
                  <p className="text-sm">PNG, JPG, WEBP up to 10MB each</p>
                </div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('isActive', !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-primary-500' : 'bg-gray-300 dark:bg-neutral-600'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('isTrending', !form.isTrending)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isTrending ? 'bg-orange-500' : 'bg-gray-300 dark:bg-neutral-600'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isTrending ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost px-6">Cancel</button>}
        <button type="submit" disabled={loading} className="btn-primary px-8 disabled:opacity-60">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </motion.form>
  );
}
