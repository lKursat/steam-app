import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const [name, setName] = useState('');
  const [genres, setGenres] = useState('');
  const [photo, setPhoto] = useState('');
  const [about, setAbout] = useState('');
  const [developer, setDeveloper] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [userName, setUserName] = useState('');
  const [games, setGames] = useState([]);
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

 // Kullanıcı Giriş Yapma 
  useEffect(() => {
    const userId = localStorage.getItem('loggedInUserId');
    if (userId) {
      fetchLoggedInUser(userId);
    }
  }, []);
  
  const fetchLoggedInUser = async (userId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`);
      setLoggedInUser(res.data);
    } catch (error) {
      console.error('Giriş yapan kullanıcı bilgisi alınamadı:', error);
    }
  };
  
  // Kullanıcı Çıkış Yapma 
  const handleLogout = () => {
    localStorage.removeItem('loggedInUserId');
    setLoggedInUser(null);
    Swal.fire('Çıkış Yapıldı', '', 'success').then(() => {
      navigate('/');
    });
  };
  
  
  //  Sayfa açıldığında oyunları çek
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/games`);
      setGames(res.data);
    } catch (error) {
      console.error('Oyunları çekme hatası:', error);
    }
  };

  //  Oyun ekleme fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/games`, {
        name,
        genres: genres.split(',').map(g => g.trim()),
        photo,
        optionalFields: { developer, releaseDate }
      });
      setName('');
      setGenres('');
      setPhoto('');
      setAbout('');
      setDeveloper('');
      setReleaseDate('');
      document.getElementById('closeModalButton').click();
      fetchGames();
      Swal.fire({
        title: 'Başarılı!',
        text: 'Oyun başarıyla eklendi.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Oyun ekleme hatası:', error);
      Swal.fire({
        title: 'Hata!',
        text: 'Oyun eklenemedi.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  //  Oyun silme fonksiyonu
  const handleDelete = async (id) => {
    if (window.confirm('Bu oyunu silmek istediğine emin misin?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/games/${id}`);
        fetchGames();
        Swal.fire({
          title: 'Başarılı!',
          text: 'Oyun başarıyla silindi.',
          icon: 'success',
          confirmButtonText: 'Tamam'
        });
      } catch (error) {
        console.error('Oyun silme hatası:', error);
        Swal.fire({
          title: 'Hata!',
          text: 'Oyun silinemedi.',
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
      }
    }
  };

  //  Puanlamayı devre dışı bırak fonksiyonu
  const handleDisableRating = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/games/disable-rating/${id}`);
      fetchGames();
      Swal.fire({
        title: 'Başarılı!',
        text: 'Puanlama ve yorum devre dışı bırakıldı.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Puanlamayı kapatma hatası:', error);
      Swal.fire({
        title: 'Hata!',
        text: 'İşlem gerçekleştirilemedi.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  //  Puanlamayı aktif hale getir fonksiyonu
  const handleEnableRating = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/games/enable-rating/${id}`);
      fetchGames();
      Swal.fire({
        title: 'Başarılı!',
        text: 'Puanlama ve yorum aktifleştirildi.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Puanlamayı açma hatası:', error);
      Swal.fire({
        title: 'Hata!',
        text: 'İşlem gerçekleştirilemedi.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  //Kullanıcı Ekleme Fonksiyonu
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, { name: userName });
      setUserName('');
      document.getElementById('closeUserModalButton').click();
      Swal.fire({
        title: 'Başarılı!',
        text: 'Kullanıcı başarıyla eklendi.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Kullanıcı ekleme hatası:', error);
      Swal.fire({
        title: 'Hata!',
        text: 'Kullanıcı eklenemedi.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };
  

  return (
      <><nav className="navbar navbar-expand-lg navbar-dark bg-black py-2">
          <div className="container-fluid">
              {/* Sol Taraftaki Elementler (Kullanıcı İşlemleri) */}
              <div className="d-flex gap-3 align-items-center">
                  {loggedInUser ? (
                      <>
                          <div className="alert alert-success mb-0 py-2 d-flex align-items-center">
                              Giriş Yapan Kullanıcı: {loggedInUser.name}
                          </div>
                          <button className="btn btn-danger" onClick={() => handleLogout()}>
                              Çıkış Yap
                          </button>
                      </>
                  ) : (
                      <button className="btn btn-primary" onClick={() => navigate('/login')}>
                          Giriş Yap
                      </button>
                  )}
              </div>

              {/* Logo (Ortada) */}
              <div className="mx-3">
                <a href="/" className="navbar-brand">
                    <img 
                        src="/logo.png" 
                        alt="Site Logosu" 
                        width="200" 
                        height="50"
                        className="d-inline-block align-top"
                    />
                </a>
              </div>

              {/* Sağ Taraftaki Butonlar */}
              <div className="d-flex gap-3">
                  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addGameModal">
                      ➕ Oyun Ekle
                  </button>
                  <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                      ➕ Kullanıcı Ekle
                  </button>
              </div>
          </div>
      </nav>
    <div className="container mt-5">
              <h1 className="text-center mb-4">🎮 Hoş Geldin!</h1>

              {/* Oyun Listesi */}
              <div className="row">
                  {games.map((game) => (
                      <div key={game._id} className="col-md-4 mb-4">
                          <div className="card h-100">
                              <img src={game.photo} className="card-img-top" alt={game.name} style={{ height: '250px', objectFit: 'cover' }} />
                              <div className="card-body d-flex flex-column">
                                  <Link to={`/game/${game._id}`} className="text-decoration-none">
                                      <h5 className="card-title">{game.name}</h5>
                                  </Link>
                                  <p className="card-text">Türler: {game.genres.join(', ')}</p>

                                  {/* Puanlama Durumu */}
                                  {game.ratingEnabled ? (
                                      <span className="badge bg-success mb-2">Puanlama Açık</span>
                                  ) : (
                                      <span className="badge bg-danger mb-2">Puanlama Kapalı</span>
                                  )}

                                  <button onClick={() => handleDelete(game._id)} className="btn btn-danger mb-2">
                                      🗑️ Sil
                                  </button>

                                  {game.ratingEnabled ? (
                                      <button onClick={() => handleDisableRating(game._id)} className="btn btn-warning">
                                          🚫 Puanlamayı Kapat
                                      </button>
                                  ) : (
                                      <button onClick={() => handleEnableRating(game._id)} className="btn btn-success">
                                          ✅ Puanlamayı Aç
                                      </button>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Modal */}
              <div className="modal fade" id="addGameModal" tabIndex="-1" aria-labelledby="addGameModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                      <div className="modal-content">
                          <form onSubmit={handleSubmit}>
                              <div className="modal-header">
                                  <h5 className="modal-title" id="addGameModalLabel">Yeni Oyun Ekle</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
                              </div>
                              <div className="modal-body">
                                  <div className="mb-3">
                                      <label>Oyun İsmi</label>
                                      <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                                  </div>
                                  <div className="mb-3">
                                      <label>Türler (virgülle ayır)</label>
                                      <input type="text" className="form-control" value={genres} onChange={(e) => setGenres(e.target.value)} required />
                                  </div>
                                  <div className="mb-3">
                                      <label>Görsel Linki</label>
                                      <input type="text" className="form-control" value={photo} onChange={(e) => setPhoto(e.target.value)} required />
                                  </div>
                                  <div className="mb-3">
                                      <label>Geliştirici </label>
                                      <input type="text" className="form-control" value={developer} onChange={(e) => setDeveloper(e.target.value)} />
                                  </div>
                                  <div className="mb-3">
                                      <label>Oyun Hakkında Bilgiler </label>
                                      <input type="text" className="form-control" value={about} onChange={(e) => setAbout(e.target.value)} />
                                  </div>
                                  <div className="mb-3">
                                      <label>Çıkış Tarihi (opsiyonel)</label>
                                      <input type="text" className="form-control" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                                  </div>
                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" id="closeModalButton" data-bs-dismiss="modal">İptal</button>
                                  <button type="submit" className="btn btn-primary">Kaydet</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
              {/* Kullanıcı Ekle Modalı */}
              <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                      <div className="modal-content">
                          <form onSubmit={handleAddUser}>
                              <div className="modal-header">
                                  <h5 className="modal-title" id="addUserModalLabel">Yeni Kullanıcı Ekle</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
                              </div>
                              <div className="modal-body">
                                  <div className="mb-3">
                                      <label>Kullanıcı İsmi</label>
                                      <input
                                          type="text"
                                          className="form-control"
                                          value={userName}
                                          onChange={(e) => setUserName(e.target.value)}
                                          required />
                                  </div>
                              </div>
                              <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" id="closeUserModalButton" data-bs-dismiss="modal">İptal</button>
                                  <button type="submit" className="btn btn-primary">Kaydet</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>


          </div></>
  );
}

export default HomePage;
