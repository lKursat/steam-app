const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  gameName: String,
  text: String,
  rating: Number,
  playTime: Number,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String },
  about: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
