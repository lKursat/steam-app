const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');

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

// Bir oyuna kullanıcı yorum ve puan ekleme
// Oyun yorumu ekleme
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params; // Game ID
    const { userId, comment, rating, playTime } = req.body;

    const game = await Game.findById(id);
    const user = await User.findById(userId);

    if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    // Kullanıcının ID'si yoksa veya eksikse hata verelim
    if (!userId) {
      return res.status(400).json({ error: 'Kullanıcı ID eksik.' });
    }

    // Eğer yorum daha önce yapılmışsa güncelle
    const existingGameCommentIndex = game.comments.findIndex(c => c.userId?.toString() === userId.toString());

    if (existingGameCommentIndex !== -1) {
      game.comments[existingGameCommentIndex].comment = comment;
      game.comments[existingGameCommentIndex].playTime = playTime;
    } else {
      game.comments.push({ userId, comment, playTime });
    }

    // Eğer puan daha önce verilmişse güncelle
    const existingRatingIndex = game.ratings.findIndex(r => r.userId?.toString() === userId.toString());

    if (existingRatingIndex !== -1) {
      game.ratings[existingRatingIndex].rating = rating;
    } else {
      game.ratings.push({ userId, rating });
    }

    // Kullanıcının yorumlarına da ekle
    const existingUserCommentIndex = user.comments.findIndex(c => c.gameName === game.name);

    if (existingUserCommentIndex !== -1) {
      user.comments[existingUserCommentIndex].text = comment;
      user.comments[existingUserCommentIndex].playTime = playTime;
    } else {
      user.comments.push({
        gameName: game.name,
        text: comment,
        playTime
      });
    }

    await game.save();
    await user.save();

    res.status(201).json({ message: 'Yorum ve puan başarıyla eklendi.' });

  } catch (err) {
    console.error('Yorum ekleme hatası:', err);
    res.status(500).json({ error: err.message });
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

//Yorum Güncelleme 

router.put('/:gameId/comment/:userId', async (req, res) => {
  try {
    const { gameId, userId } = req.params;
    const { comment, rating, playTime } = req.body;
    const game = await Game.findById(gameId);

    if (!game) return res.status(404).json({ error: 'Oyun bulunamadı' });

    const userComment = game.comments.find(c => c.userId === userId);
    const userRating = game.ratings.find(r => r.userId === userId);

    if (userComment) {
      userComment.comment = comment;
      userComment.playTime = playTime;
    }
    if (userRating) {
      userRating.rating = rating;
    }

    await game.save();
    res.json({ message: 'Yorum ve puan güncellendi.' });
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
