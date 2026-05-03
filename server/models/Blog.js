const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  excerpt: {
    type: String,
    maxlength: 300,
  },
  category: {
    type: String,
    required: true,
    enum: ['Fashion', 'Beauty'],
  },
  coverImage: {
    type: String,
    default: '',
  },
  coverImagePublicId: String,
  images: {
    type: [String],
    default: [],
  },
  tags: [String],
  author: {
    type: String,
    default: 'Admin',
  },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  comments: [commentSchema],
  // Embedded affiliate products
  featuredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  // Pinterest / SEO meta
  metaTitle: String,
  metaDescription: String,
  pinterestDescription: String,
}, { timestamps: true });

// Auto generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
