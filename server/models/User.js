const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  bookmarks: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'bookmarks.itemType',
      },
      itemType: {
        type: String,
        required: true,
        enum: ['Blog', 'Product'],
      },
      title: String,
      slug: String,
      coverImage: String,
      type: {
        type: String,
        enum: ['blog', 'product'],
        required: true,
      },
      savedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likedBlogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
