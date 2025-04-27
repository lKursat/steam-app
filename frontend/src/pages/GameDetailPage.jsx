import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GameDetailPage() {
  const { id } = useParams(); // URL'den oyun ID'si al
  const [game, setGame] = useState(null);

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
        <h4>📄 Açıklama:</h4>
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
      <div>
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
    </div>
  );
}

export default GameDetailPage;
