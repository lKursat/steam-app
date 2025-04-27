const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const gameRoutes = require('./routes/games');
app.use('/api/games', gameRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// MongoDB Atlas'a bağlan
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas bağlantısı başarılı'))
  .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Sunucu ${PORT} portunda çalışıyor`);
});
