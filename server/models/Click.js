const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  resourceType: {
    type: String,
    enum: ['blog', 'product'],
    required: true,
  },
  ipHash: String,
  userAgent: String,
  country: String,
}, { timestamps: true });

module.exports = mongoose.model('Click', clickSchema);
