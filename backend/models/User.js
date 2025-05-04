const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  about: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
