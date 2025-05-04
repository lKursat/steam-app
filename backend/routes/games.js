const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const Comment = require('../models/Comment');


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
      ratingEnabled: true, 
      comments: [],
      ratings: []
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, genres, photo, optionalFields } = req.body;
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      {
        name,
        genres,
        photo,
        optionalFields
      },
      { new: true, runValidators: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ error: 'Oyun bulunamadı' });
    }
    res.json(updatedGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
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

// Bir oyuna kullanıcı yorum ve puan ekleme
// POST /games/:id/comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params; // Oyun ID'si
    const { userId, comment, rating, playTime } = req.body;

    const game = await Game.findById(id);
    const user = await User.findById(userId);

    if (!game || !user) {
      return res.status(404).json({ error: 'Oyun veya kullanıcı bulunamadı!' });
    }

    // Game içindeki yorum ve puanı güncelle (varsa)
    const existingGameCommentIndex = game.comments.findIndex(c => c.userId?.toString() === userId);
    if (existingGameCommentIndex !== -1) {
      game.comments[existingGameCommentIndex] = { userId, comment, playTime };
    } else {
      game.comments.push({ userId, comment, playTime });
    }

    const existingRatingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId);
    if (existingRatingIndex !== -1) {
      game.ratings[existingRatingIndex].rating = rating;
    } else {
      game.ratings.push({ userId, rating });
    }

    // 🎯 Comment modeline ekle
    const newComment = new Comment({
      userId: user._id,
      gameId: game._id,
      gameName: game.name, // bu oyun bilgisi UserProfile'da görünecek
      text: comment,
      rating,
      playTime
    });

    await newComment.save();

    // Kullanıcının comment listesine ekle
    user.comments.push(newComment._id);

    // Kaydet
    await game.save();
    await user.save();

    res.status(201).json({ message: 'Yorum ve puan başarıyla eklendi!' });

  } catch (err) {
    console.error("Hata Detayları:", err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});



//  Yorumları Silme

router.delete('/:gameId/comment/:userId', async (req, res) => {
  try {
    const { gameId, userId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });

    game.comments = game.comments.filter(c => c.userId !== userId);
    game.ratings = game.ratings.filter(r => r.userId !== userId);

    await game.save();
    res.json({ message: 'Yorum ve puan silindi.' });
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
