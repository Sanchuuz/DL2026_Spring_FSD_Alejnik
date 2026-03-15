const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  imageUrl: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Meme', memeSchema);
