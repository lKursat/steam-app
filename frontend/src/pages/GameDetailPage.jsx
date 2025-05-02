import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import StarRating from '../components/StarRating';
import { FaStar, FaTrash } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';


function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [playTime, setPlayTime] = useState('');
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  const [newRating, setNewRating] = useState(0);

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

  const handleDeleteComment = async (userIdToDelete) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/games/${id}/comment/${userIdToDelete}`);
      Swal.fire('Yorum silindi!', '', 'success');
      fetchGame(); // Yorumları yenile
    } catch (err) {
      console.error('Yorum silme hatası:', err);
      Swal.fire('Hata!', 'Yorum silinemedi.', 'error');
    }
  };
  

  if (!game) return <p>Yükleniyor...</p>;

  const averageRating = game.ratings && game.ratings.length > 0
    ? (game.ratings.reduce((acc, curr) => acc + curr.rating, 0) / game.ratings.length).toFixed(1)
    : 'Henüz puan yok';

    return (
      <>
        {/* Navbar */}
        <nav className="navbar navbar-dark bg-black justify-content-center py-3">
          <a href="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/logo.png"
              alt="Site Logosu"
              style={{ height: '50px' }}
              className="d-inline-block align-top"
            />
          </a>
        </nav>
    
        {/* İçerik */}
        <div className="container mt-5">
        <Carousel className="mb-4 rounded overflow-hidden shadow">
          {game.photos && game.photos.length > 0 ? (
            game.photos.map((photo, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={photo}
                  alt={`slide-${idx}`}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))
          ) : (
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={game.photo} // Ana fotoğraf fallback
                alt="Ana görsel"
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          )}
        </Carousel>

          
          <div className="detail-header">
        <h2>{game.name}</h2>
        {game.optionalFields?.developer && (
          <p><strong>Geliştirici:</strong> {game.optionalFields.developer}</p>
        )}
        {game.optionalFields?.releaseDate && (
          <p><strong>Çıkış Tarihi:</strong> {game.optionalFields.releaseDate}</p>
        )}
      </div>

      <div className="detail-header"><h2> Oyun Hakkında</h2>
      <p>{game.optionalFields?.about || 'Açıklama yok.'}</p></div>

      <div className="detail-section-title">⭐ Ortalama Puan</div>
      <h4 className="text-warning">{averageRating}</h4>
    
          {/* Yorumlar */}
          <div className="mt-5">
            <h4 className="text-light">💭 Kullanıcı Yorumları</h4>
            {game.comments && game.comments.length > 0 ? (
              <ul className="list-unstyled">
                {game.comments.map((comment, index) => {
                  const user = users.find((u) => u._id === comment.userId);
                  const rating = game.ratings.find(r => r.userId === comment.userId)?.rating || 0;
    
                  return (
                    <li
                      key={index}
                      className="d-flex align-items-center justify-content-between p-3 mb-3 rounded"
                      style={{ backgroundColor: "#1e1e1e" }}
                    >
                      {/* Sol: Kullanıcı */}
                      <div className="d-flex align-items-center" style={{ width: '30%' }}>
                        <img
                          src={user?.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                          alt={user?.name || 'Kullanıcı'}
                          className="rounded-circle me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="text-light fw-bold">{user?.name || 'Bilinmeyen'}</div>
                      </div>
    
                      {/* Orta: Yorum */}
                      <div className="text-light" style={{ width: '50%' }}>
                        <p className="mb-1">{comment.comment}</p>
                        <small className="text-muted-white">🕒 {comment.playTime} saat oynadı</small>
                      </div>
    
                      {/* Sağ: Yıldızlar + Sil */}
                      <div className="d-flex flex-column align-items-end" style={{ width: '20%' }}>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={20}
                              color={i < rating ? "#ffc107" : "#555"}
                              className="me-1"
                            />
                          ))}
                        </div>
                        {loggedInUserId === comment.userId && (
                          <button
                            onClick={() => handleDeleteComment(comment.userId)}
                            className="btn btn-sm icon-btn bg-dark text-white"
                             title="Sil"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-white">Henüz yorum yapılmamış.</p>
            )}
          </div>
    
          {/* Yorum ve Puan Ekleme Formu */}
          {loggedInUserId ? (
            <div className="mt-5 p-4 rounded" style={{ backgroundColor: '#1e1e1e' }}>
              <h5 className="text-light mb-4">💬 Yorum Yap</h5>
              <form onSubmit={handleAddComment}>
                <div className="mb-3">
                  <label className="form-label text-light">Yorum</label>
                  <textarea
                    className="form-control bg-dark text-light border-0"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                    required
                  />
                </div>
    
                <div className="mb-3">
                  <label className="form-label text-light">Oynama Süresi (saat)</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-light border-0"
                    value={playTime}
                    onChange={(e) => setPlayTime(e.target.value)}
                    required
                  />
                </div>
    
                <div className="mb-3">
                  <label className="form-label text-light">Puan</label>
                  <StarRating rating={newRating} setRating={setNewRating} />
                </div>
    
                <button type="submit" className="btn btn-success">Yorumu Gönder</button>
              </form>
            </div>
          ) : (
            <div className="alert alert-warning mt-4">
              ➡️ Yorum yapabilmek için önce <strong>giriş yapmalısın!</strong>
            </div>
          )}
        </div>
    
        {/* Footer */}
        <footer className="navbar navbar-dark bg-black justify-content-center py-4 mt-5">
          <div className="d-flex flex-column align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src="/logo.png"
                alt="Footer Logo"
                style={{ height: '40px', filter: 'brightness(0.8)' }}
              />
              <span className="text-muted-white" style={{ fontFamily: 'Arial', fontSize: '1.2rem', letterSpacing: '1.2px' }}>
                OYUN PLATFORMU
              </span>
            </div>
            <div className="text-center">
              <p className="mb-1 text-secondary">© {new Date().getFullYear()} Tüm hakları saklıdır</p>
              <p className="mb-0 text-secondary">Proje ürünüdür.</p>
            </div>
          </div>
        </footer>
      </>
    );
}
export default GameDetailPage;