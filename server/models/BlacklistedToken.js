const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', // TTL index: document will be automatically removed after 7 days
  },
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
