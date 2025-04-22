const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  totalPlayTime: Number,
  averageRating: Number,
  mostPlayedGame: String,
  comments: [
    {
      gameName: String,
      text: String,
      playTime: Number
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
