
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
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

module.exports = mongoose.models.Game || mongoose.model('Game', gameSchema);

