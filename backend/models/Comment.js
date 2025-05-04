// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  gameName: String,
  text: String,
  rating: Number,
  playTime: Number
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
