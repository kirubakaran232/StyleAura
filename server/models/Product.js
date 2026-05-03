const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      publicId: String,
    }
  ],
  affiliateLink: {
    type: String,
    required: [true, 'Affiliate link is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Fashion', 'Beauty'],
  },
  price: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  clicks: { type: Number, default: 0 },
  pros: [String],
  cons: [String],
  isActive: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: false },
  // SEO
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

// Auto generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
