const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Oyun ekle
router.post('/', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tüm oyunları getir
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
