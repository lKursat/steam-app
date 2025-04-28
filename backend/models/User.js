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
  comments: [commentSchema],
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Game',
    default: []
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
