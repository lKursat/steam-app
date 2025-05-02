import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; 

function UserProfilePage() {
  const { id } = useParams();
  const { loggedInUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchGames();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
      setUser(res.data);
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

  if (!user) return <p>Yükleniyor...</p>;
    // ...
  
    const favoriteGames = user?.favorites?.map(name => 
      games.find(game => game.name === name)
    ).filter(Boolean);
  
  return (
    <>
  {/* Navbar */}
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

      {/* Kullanıcı Bilgisi */}
                    <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="user-card bg-dark text-light p-5 rounded-4 shadow-lg position-relative d-flex flex-column align-items-center" style={{ width: '100%', maxWidth: '600px' }}>
                    
                    {/* Profil Fotoğrafı */}
                    <div className="profile-pic-wrapper mb-3 position-relative">
                        <img
                        src={user?.photo || '/default-avatar.png'}
                        alt="Profil"
                        className="rounded-circle border border-secondary shadow"
                        style={{
                            width: '140px',
                            height: '140px',
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        />
                    </div>

                    {/* Kullanıcı Adı */}
                    <h3 className="fw-bold mb-1 text-info">{user?.name}</h3>

                    {/* Kayıt Tarihi */}
                    <small className="text-muted-white">
                        Kayıt Tarihi: {new Date(user?.createdAt).toLocaleDateString('tr-TR')}
                    </small>
                    <br></br>
                    <small className="text-muted-white">
                        Hakkımda: {user?.about}
                    </small>

                    {/* Buton */}
                    <button
                        className="btn btn-outline-info mt-4 px-4 py-2 rounded-pill"
                        onClick={() => window.location.href = `/edit-profile/${user._id}`}
                    >
                        Profili Düzenle
                    </button>
                    </div>
                </div>
                </div>

        <div className="container mt-5">
                <h4 className="text-light mb-4">Favori Oyunlar</h4>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {favoriteGames.map((game, index) => (
                    <div className="col" key={index}>
                    <div className="card bg-dark text-light h-100 d-flex flex-row align-items-center game-favorite-card">
                        <img
                        src={game.image}
                        className="img-fluid rounded-start"
                        style={{ width: '150px', height: '100%', objectFit: 'cover' }}
                        alt={game.name}
                        />
                        <div className="card-body">
                        <h5 className="card-title text-info">{game.name}</h5>
                        <p className="card-text small text-muted">{game.description.slice(0, 100)}...</p>
                        <Link to={`/game/${game._id}`} className="btn btn-outline-info btn-sm mt-2">
                            Detay
                        </Link>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
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

export default UserProfilePage;

