import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const { loggedInUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [editedUser, setEditedUser] = useState({ name: '', about: '', photo: '' });

  useEffect(() => {
    fetchUser();
    fetchGames();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
      setUser(res.data);
      setEditedUser({
        name: res.data.name || '',
        about: res.data.about || '',
        photo: res.data.photo || '',
      });
    } catch (error) {
      console.error('Kullanıcı bilgisi alınamadı:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/games`);
      setGames(res.data);
    } catch (error) {
      console.error('Oyunları çekme hatası:', error);
    }
  };
  const mostPlayedGame = useMemo(() => {
    if (user && user.favorites && user.favorites.length > 0) {
      return user.favorites.reduce((prev, current) => {
        return (prev.playTime || 0) > (current.playTime || 0) ? prev : current;
      });
    }
    return null;
  }, [user]);


  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${id}`, editedUser);
      setShowModal(false);
      fetchUser(); // Güncellenmiş kullanıcıyı çek
    } catch (err) {
      console.error('Kullanıcı güncellenemedi:', err);
    }
  };

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-black justify-content-center py-3">
        <a href="/" className="navbar-brand d-flex align-items-center">
          <img src="/logo.png" alt="Site Logosu" style={{ height: '50px' }} />
        </a>
      </nav>

      {/* Kullanıcı Kartı */}
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="user-card text-light bg-dark p-5 rounded-4 shadow-lg d-flex flex-column align-items-center" style={{ width: '100%', maxWidth: '500px' }}>
            <img
              src={user?.photo || '/default-avatar.png'}
              alt="Profil"
              className="rounded-circle border border-secondary mb-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
            <h3 className="fw-bold mb-1 text-info">{user?.name}</h3>
            {user?.createdAt && (
              <small className="text-muted">
                Kayıt Tarihi: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
              </small>
            )}
            {user?.about && (
              <p className="mt-3 text-light text-center">{user.about}</p>
            )}
            <button
              className="btn btn-outline-info mt-3 px-4 py-2 rounded-pill"
              onClick={() => setShowModal(true)}
            >
              Profili Düzenle
            </button>
          </div>
        </div>
      </div>

      {/* Profil Düzenleme Modalı */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profili Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label>İsim</label>
            <input
              className="form-control"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label>Hakkımda</label>
            <textarea
              className="form-control"
              value={editedUser.about}
              onChange={(e) => setEditedUser({ ...editedUser, about: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label>Profil Fotoğrafı URL</label>
            <input
              className="form-control"
              value={editedUser.photo}
              onChange={(e) => setEditedUser({ ...editedUser, photo: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>İptal</Button>
          <Button variant="primary" onClick={handleSave}>Kaydet</Button>
        </Modal.Footer>
      </Modal>
    {/* En Çok Oynanan Oyun */}
    {mostPlayedGame && (
      <div className="container mt-5">
        <div className="card bg-dark text-light rounded-4 shadow-lg p-4">
          <h4 className="text-info mb-2">🎮 En Çok Oynanan Oyun</h4>
          <div className="d-flex align-items-center">
            <img
              src={mostPlayedGame.photo || '/default-game.png'}
              alt={mostPlayedGame.gameName}
              className="rounded-3 me-3"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <div>
              <h5 className="mb-1">{mostPlayedGame.gameName}</h5>
              <small className="text-muted">{mostPlayedGame.playTime} saat oynanmış</small>
            </div>
          </div>
        </div>
      </div>
    )}

{/* Favori Oyunlar */}
<div className="container mt-5">
  <h4 className="text-light mb-4">Favori Oyunlar</h4>
  <div className="row row-cols-1 row-cols-md-2 g-4">
    {user.favorites && user.favorites.length > 0 ? (
      user.favorites.map((game) => (
        <div key={game._id} className="col">
          <div className="card bg-dark text-light h-100 d-flex flex-row overflow-hidden rounded-4 shadow-lg">
            {/* Oyun resmi */}
            <img
              src={game.photo || '/default-game.png'}
              className="img-fluid"
              style={{ width: '150px', objectFit: 'cover' }}
              alt={game.name}
            />
            {/* Oyun bilgileri */}
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title text-info">{game.name}</h5>
              <p className="card-text small text-secondary" style={{ maxHeight: '4.5em', overflow: 'hidden' }}>
                {game.description}
              </p>
              <Link to={`/game/${game._id}`} className="btn btn-outline-info btn-sm mt-2 rounded-pill w-50">
                Detaylar
                </Link>

            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-secondary">Henüz favori oyununuz yok.</p>
    )}
  </div>
</div>

    {/* Yorumlar */}
    <div className="container mt-5">
      <h4 className="text-light mb-4">Yorumlar</h4>
      {user.comments && user.comments.length > 0 ? (
        user.comments.map((comment, index) => (
          <div
            key={index}
            className="card bg-dark text-light shadow-sm mb-3 p-3 rounded-4"
            style={{ borderLeft: '5px solid #17a2b8' }}
          >
            <div className="d-flex justify-content-between">
              <strong className="text-info">{comment.userName || 'Kullanıcı'}</strong>
              <span className="text-muted small">{comment.playTime} saat</span>
            </div>
            <p className="mt-2 mb-0 fst-italic text-light">{comment.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-secondary">Henüz yorum yapılmamış.</p>
      )}
    </div>


      {/* Footer */}
      <footer className="navbar navbar-dark bg-black justify-content-center py-4 mt-5">
        <div className="text-center text-secondary">
          <p className="mb-1">© {new Date().getFullYear()} Tüm hakları saklıdır</p>
          <p className="mb-0">Proje ürünüdür.</p>
        </div>
      </footer>
    </>
  );
}

export default UserProfilePage;
