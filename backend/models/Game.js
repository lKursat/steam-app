
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,
  genres: [String],
  photo: String,
  optionalFields: Object,
  playTime: Number,
  ratingEnabled: { type: Boolean, default: true },
  comments: [
    {
      userId: String,
      comment: String,
      playTime: Number
    }
  ],
  ratings: [
    {
      userId: String,
      playTime: Number,
      rating: Number
    }
  ]
});

module.exports = mongoose.model('Game', gameSchema);

