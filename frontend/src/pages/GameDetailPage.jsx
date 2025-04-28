import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function GameDetailPage() {
  const { id } = useParams(); // URL'den oyun ID'si al
  const [game, setGame] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [userId, setUserId] = useState('');
  const [playTime, setPlayTime] = useState('');

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/games/${id}`);
      setGame(res.data);
    } catch (error) {
      console.error('Oyun bilgisi alınamadı:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/games/${id}/comment`, {
        userId,
        comment: newComment,
        rating: parseFloat(newRating),
        playTime: parseFloat(playTime),
      });
      Swal.fire({
        title: 'Başarılı!',
        text: 'Yorum ve puan eklendi!',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
      setNewComment('');
      setNewRating('');
      setUserId('');
      setPlayTime('');
      fetchGame(); // Yorum eklenince güncelle
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
      Swal.fire({
        title: 'Hata!',
        text: 'Yorum eklenemedi!',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  if (!game) return <p>Yükleniyor...</p>;

  // Ortalama puan hesaplama
  const averageRating = game.ratings && game.ratings.length > 0
    ? (game.ratings.reduce((acc, curr) => acc + curr.rating, 0) / game.ratings.length).toFixed(1)
    : 'Henüz puan yok';

  return (
    <div className="container mt-5">
      <h2>{game.name}</h2>
      <img src={game.photo} alt={game.name} className="img-fluid mb-4" style={{ maxHeight: '400px', objectFit: 'cover' }} />

      {/* Oyun Bilgileri */}
      <div className="mb-4">
        {game.optionalFields && game.optionalFields.about && (
          <p><strong>Oyun Hakkında:</strong> {game.optionalFields.about}</p>
        )}
        {game.optionalFields && game.optionalFields.developer && (
          <p><strong>Geliştirici:</strong> {game.optionalFields.developer}</p>
        )}
        {game.optionalFields && game.optionalFields.releaseDate && (
          <p><strong>Çıkış Tarihi:</strong> {game.optionalFields.releaseDate}</p>
        )}
      </div>

      {/* Ortalama Puan */}
      <div className="mb-4">
        <h4>⭐ Ortalama Puan: {averageRating}</h4>
      </div>

      {/* Yorumlar */}
      <div className="mb-5">
        <h4>💬 Kullanıcı Yorumları</h4>
        {game.comments && game.comments.length > 0 ? (
          <ul className="list-group">
            {game.comments.map((comment, index) => (
              <li key={index} className="list-group-item">
                <strong>Kullanıcı:</strong> {comment.userId} <br />
                <strong>Yorum:</strong> {comment.comment || 'Yorum yok'} <br />
                <strong>Oynama Süresi:</strong> {comment.playTime} saat
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz yorum yapılmamış.</p>
        )}
      </div>

      {/* Yorum ve Puan Ekleme Formu */}
      <div className="mt-5">
        <h4>➕ Yorum ve Puan Ekle</h4>
        <form onSubmit={handleAddComment}>
          <div className="mb-3">
            <label>Kullanıcı ID</label>
            <input
              type="text"
              className="form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Yorum</label>
            <textarea
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label>Puan (1-5)</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="5"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Oynama Süresi (saat)</label>
            <input
              type="number"
              className="form-control"
              value={playTime}
              onChange={(e) => setPlayTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Gönder</button>
        </form>
      </div>
    </div>
  );
}

export default GameDetailPage;

