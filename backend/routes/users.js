const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Game = require('../models/Game');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');

// Kullanıcı detayını getir
router.get('/', async (req, res) => {
    try {
      const users = await User.find(); // MongoDB'den tüm kullanıcıları al
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Geçersiz kullanıcı ID' });
    }
  
    try {
      const user = await User.findById(id)
        .populate('favorites')
        .populate({
          path: 'comments',
          model: 'Comment', // Buradaki model adı Comment model dosyanla birebir aynı olmalı
        });
  
      if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }
  
      console.log("Yorumlar (populated):", user.comments); // Bunu ekle kontrol için
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  

// Örnek Express route
// routes/users.js
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {
          path: 'gameId',
          model: 'Game'
        }
      });
    res.json(user);
  } catch (err) {
    console.error('Kullanıcı verisi alınamadı:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.post('/', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Kullanıcı oyun yorumu eklesin
router.post('/:userId/comment/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;
    const { comment } = req.body;
  
    try {
      const user = await User.findById(userId);
      const game = await Game.findById(gameId);
  
      if (!user || !game) {
        return res.status(404).json({ error: 'Kullanıcı veya oyun bulunamadı' });
      }
  
      // Kullanıcı bu oyunu en az 1 saat oynamış mı?
      const userPlayTimeOnGame = game.comments.find(c => c.userId === userId)?.playTime || 0;
  
      if (userPlayTimeOnGame < 1) {
        return res.status(400).json({ error: 'Yorum yapabilmek için önce bu oyunu oynamalısınız (1 saat minimum).' });
      }
  
      // 1. Kullanıcıya yorumu ekle (varsa güncelle)
      const existingUserCommentIndex = user.comments.findIndex(c => c.gameName === game.name);
      if (existingUserCommentIndex !== -1) {
        user.comments[existingUserCommentIndex].text = comment;
      } else {
        user.comments.push({ gameName: game.name, text: comment, playTime: userPlayTimeOnGame });
      }
  
      // 2. Oyuna yorumu ekle (varsa güncelle)
      const existingGameCommentIndex = game.comments.findIndex(c => c.userId === userId);
      if (existingGameCommentIndex !== -1) {
        game.comments[existingGameCommentIndex].comment = comment;
      } else {
        game.comments.push({ userId, comment, playTime: userPlayTimeOnGame });
      }
  
      await user.save();
      await game.save();
  
      res.json({ message: 'Yorum başarıyla eklendi' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Favoriye ekle
router.post('/:userId/favorites/:gameId', async (req, res) => {
  try {
    const { userId, gameId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    // Eğer daha önce eklenmemişse ekle
    if (!user.favorites.includes(gameId)) {
      user.favorites.push(gameId);
      await user.save();
    }

    res.status(200).json({ message: 'Favoriye eklendi' });
  } catch (error) {
    console.error('Favori ekleme hatası:', error);
    res.status(500).json({ error: 'Favori ekleme başarısız' });
  }
});

  
  
  // Favori Çıkar
// Favoriden çıkar
router.delete('/:userId/favorites/:gameId', async (req, res) => {
  try {
    const { userId, gameId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    user.favorites = user.favorites.filter(fav => fav.toString() !== gameId);
    await user.save();

    res.status(200).json({ message: 'Favoriden çıkarıldı' });
  } catch (error) {
    console.error('Favori çıkarma hatası:', error);
    res.status(500).json({ error: 'Favoriden çıkarma başarısız' });
  }
});
  
module.exports = router;
