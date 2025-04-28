import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [playTime, setPlayTime] = useState('');
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  useEffect(() => {
    fetchGame();
    fetchUsers();
  }, [id]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/games/${id}`);
      setGame(res.data);
    } catch (error) {
      console.error('Oyun bilgisi alınamadı:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Kullanıcıları çekme hatası:', error);
    }
  };

  const findUserNameById = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? user.name : 'Bilinmeyen Kullanıcı';
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!loggedInUserId) {
      Swal.fire('Hata!', 'Lütfen giriş yapın!', 'error');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/games/${id}/comment`, {
        userId: loggedInUserId,
        comment: newComment,
        rating: parseFloat(newRating),
        playTime: parseFloat(playTime),
      });
      Swal.fire('Başarılı!', 'Yorum ve puan eklendi!', 'success');
      setNewComment('');
      setNewRating('');
      setPlayTime('');
      fetchGame();
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
      Swal.fire('Hata!', 'Yorum eklenemedi!', 'error');
    }
  };

  const handleDeleteComment = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/games/${id}/comment/${userId}`);
      Swal.fire('Başarılı!', 'Yorum silindi.', 'success');
      fetchGame();
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      Swal.fire('Hata!', 'Yorum silinemedi.', 'error');
    }
  };

  const handleEditComment = (comment) => {
    setNewComment(comment.comment);
    setPlayTime(comment.playTime);
    const userRating = game.ratings.find(r => r.userId === comment.userId);
    setNewRating(userRating ? userRating.rating : '');
  };

  if (!game) return <p>Yükleniyor...</p>;

  const averageRating = game.ratings && game.ratings.length > 0
    ? (game.ratings.reduce((acc, curr) => acc + curr.rating, 0) / game.ratings.length).toFixed(1)
    : 'Henüz puan yok';

  return (
    <div className="container mt-5">
      <h2>{game.name}</h2>
      <img src={game.photo} alt={game.name} className="img-fluid mb-4" style={{ maxHeight: '400px', objectFit: 'cover' }} />

      {/* Oyun Bilgileri */}
      <div className="mb-4">
        {game.optionalFields?.about && (
          <p><strong>Oyun Hakkında:</strong> {game.optionalFields.about}</p>
        )}
        {game.optionalFields?.developer && (
          <p><strong>Geliştirici:</strong> {game.optionalFields.developer}</p>
        )}
        {game.optionalFields?.releaseDate && (
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
                <strong>Kullanıcı:</strong> {findUserNameById(comment.userId)} <br />
                <strong>Yorum:</strong> {comment.comment || 'Yorum yok'} <br />
                <strong>Oynama Süresi:</strong> {comment.playTime} saat <br />
                <strong>Verilen Puan:</strong> {
                  game.ratings.find(r => r.userId === comment.userId)?.rating || 'Puan Yok'
                }
                {/* Sadece giriş yapan kendi yorumunu görebilir */}
                {loggedInUserId === comment.userId && (
                  <div className="mt-2">
                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeleteComment(comment.userId)}>
                      Sil
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => handleEditComment(comment)}>
                      Düzenle
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz yorum yapılmamış.</p>
        )}
      </div>

      {/* Yorum ve Puan Ekleme Formu */}
      {loggedInUserId ? (
        <div className="mt-5">
          <h4>➕ Yorum ve Puan Ekle</h4>
          <form onSubmit={handleAddComment}>
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
      ) : (
        <div className="alert alert-warning mt-5">
          ➡️ Yorum yapabilmek için önce <strong>giriş yapmalısın!</strong>
        </div>
      )}
    </div>
  );
}

export default GameDetailPage;


