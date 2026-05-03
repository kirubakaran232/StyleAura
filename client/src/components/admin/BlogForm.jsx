import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createBlog, updateBlog } from '../../services/api';

const CATEGORIES = ['Fashion', 'Beauty'];

const EMPTY = {
  title: '', content: '', excerpt: '', category: 'Fashion',
  tags: '', isPublished: true, metaTitle: '', metaDescription: '', pinterestDescription: '',
};

function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('blob')) return img;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return baseUrl + img;
}

// Simple textarea-based content editor (works without react-quill bundle issues)
export default function BlogForm({ blog, onSuccess, onCancel }) {
  const [form, setForm] = useState(blog ? {
    ...blog,
    tags: (blog.tags || []).join(', '),
  } : EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.coverImage ? getImageUrl(blog.coverImage) : '');
  const [existingImages, setExistingImages] = useState(blog?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const extrasRef = useRef();

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleExtras = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeExtra = (idx) => {
    if (idx < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== idx));
      return;
    }
    const fileIdx = idx - existingImages.length;
    setNewImages(prev => prev.filter((_, i) => i !== fileIdx));
    setNewPreviews(prev => prev.filter((_, i) => i !== fileIdx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category) {
      return toast.error('Title, content, and category are required');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      if (imageFile) fd.append('coverImage', imageFile);
      // Tell backend which existing images to keep on update.
      if (blog) {
        fd.append('existingImages', JSON.stringify(existingImages));
      }
      newImages.forEach(f => fd.append('images', f));

      if (blog) {
        await updateBlog(blog._id, fd);
        toast.success('Blog updated!');
      } else {
        await createBlog(fd);
        toast.success('Blog created!');
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
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
        {/* Title */}
        <div className="md:col-span-2">
          <label className="label">Title *</label>
          <input className="input" placeholder="Blog post title..." value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>

        {/* Category */}
        <div>
          <label className="label">Category *</label>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="label">Tags (comma-separated)</label>
          <input className="input" placeholder="fashion, summer, trending..." value={form.tags} onChange={e => set('tags', e.target.value)} />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className="label">Excerpt</label>
          <textarea className="input resize-none h-20" placeholder="Short description for cards and SEO..." value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label className="label">Content * (HTML supported)</label>
          <textarea
            className="input resize-y min-h-[300px] font-mono text-sm"
            placeholder="Write your blog content here... You can use HTML tags like <h2>, <p>, <ul>, <strong>, etc."
            value={form.content}
            onChange={e => set('content', e.target.value)}
            required
          />
          <p className="text-xs text-gray-400 mt-1">HTML is supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;img&gt; etc.</p>
        </div>

        {/* Cover Image */}
        <div className="md:col-span-2">
          <label className="label">Cover Image</label>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-2xl p-6 cursor-pointer
                       hover:border-primary-400 transition-colors flex items-center gap-4"
          >
            {imagePreview ? (
              <>
                <img src={imagePreview.startsWith('blob') ? imagePreview : imagePreview} alt="preview" className="w-24 h-24 object-cover rounded-xl" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Image selected</p>
                  <p className="text-sm text-gray-400">Click to change</p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setImagePreview(''); setImageFile(null); }} className="ml-auto text-gray-400 hover:text-red-500">
                  <FiX size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 text-gray-400">
                <FiUpload size={24} />
                <div>
                  <p className="font-medium">Click to upload cover image</p>
                  <p className="text-sm">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        {/* Extra Images */}
        <div className="md:col-span-2">
          <label className="label">More Images (shown in post gallery)</label>
          <div className="space-y-3">
            <div
              onClick={() => extrasRef.current.click()}
              className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-2xl p-6 cursor-pointer
                         hover:border-primary-400 transition-colors flex items-center gap-3 text-gray-400"
            >
              <FiUpload size={22} />
              <div>
                <p className="font-medium">Click to add more images</p>
                <p className="text-sm">You can select multiple files</p>
              </div>
            </div>
            <input ref={extrasRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtras} />

            {(existingImages.length + newPreviews.length) > 0 && (
              <div className="flex flex-wrap gap-3">
                {[...existingImages.map(getImageUrl), ...newPreviews].map((src, idx) => (
                  <div key={src + idx} className="relative">
                    <img src={src} alt={`extra-${idx}`} className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-neutral-700" />
                    <button
                      type="button"
                      onClick={() => removeExtra(idx)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700
                                 flex items-center justify-center text-gray-500 hover:text-red-500 shadow"
                      title="Remove"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO */}
        <div>
          <label className="label">Meta Title (SEO)</label>
          <input className="input" placeholder="SEO title..." value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
        </div>
        <div>
          <label className="label">Pinterest Description</label>
          <input className="input" placeholder="Description for Pinterest sharing..." value={form.pinterestDescription} onChange={e => set('pinterestDescription', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Meta Description (SEO)</label>
          <textarea className="input resize-none h-16" placeholder="SEO meta description..." value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set('isPublished', !form.isPublished)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-primary-500' : 'bg-gray-300 dark:bg-neutral-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <label className="label mb-0">Published</label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost px-6">Cancel</button>}
        <button type="submit" disabled={loading} className="btn-primary px-8 disabled:opacity-60">
          {loading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>
    </motion.form>
  );
}
