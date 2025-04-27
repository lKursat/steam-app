const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Oyun Ekle
router.post('/', async (req, res) => {
  try {
    const { name, genres, photo, optionalFields } = req.body;

    if (!name || !genres || !photo) {
      return res.status(400).json({ error: 'İsim, tür ve görsel zorunludur.' });
    }

    const newGame = new Game({
      name,
      genres,
      photo,
      optionalFields,
      playTime: 0,
      ratingEnabled: true, // puanlama ve yorum aktif başlıyor
      comments: [],
      ratings: []
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Oyun Silme
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Oyun bulunamadı' });
    }
    res.json({ message: 'Oyun başarıyla silindi.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Oyun için Puanlama ve Yorumu Devre Dışı Bırak
router.put('/disable-rating/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { ratingEnabled: false }, { new: true });
    if (!game) {
      return res.status(404).json({ error: 'Oyun bulunamadı' });
    }
    res.json({ message: 'Puanlama ve yorum devre dışı bırakıldı.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Oyun için Puanlama ve Yorumu Aktif Hale Getir
router.put('/enable-rating/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { ratingEnabled: true }, { new: true });
    if (!game) {
      return res.status(404).json({ error: 'Oyun bulunamadı' });
    }
    res.json({ message: 'Puanlama ve yorum aktif hale getirildi.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Belirli bir oyunun detayını getir
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Oyun bulunamadı' });
    }
    res.json(game);
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
