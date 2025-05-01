import React, { useEffect, useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';

function UserProfilePage() {
  const { id } = useParams();
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

  // Game ismine göre detay bulma
  const getGameDetailsByName = (gameName) => {
    return games.find(g => g.name === gameName);
  };

  return (
    <>
  {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-black py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
    
              {/* Orta - Logo */}
              <div className="mx-3 text-center">
              <Link to="/" className="navbar-brand">
                <img src="/logo.png" alt="Site Logosu" width="200" height="50" className="d-inline-block align-top" />
              </Link>
            </div>
    <div className="container mt-5">
      {/* Kullanıcı Bilgisi */}
      <div className="text-center mb-5">
        <img
          src={user.photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
          alt={user.name}
          className="rounded-circle"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
        <h2 className="mt-3">{user.name}</h2>
        {user.about && <p className="text-muted">{user.about}</p>}
      </div>

      {/* Favori Oyunlar */}
      <div className="mt-5">
        <h4>🌟 Favori Oyunlarım</h4>
        {user.favorites && user.favorites.length > 0 ? (
          <div className="row">
            {games
              .filter(game => user.favorites.some(favId => favId.toString() === game._id.toString()))
              .map((favGame, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <img
                      src={favGame.photo}
                      alt={favGame.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{favGame.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p>Favori oyun bulunamadı.</p>
        )}
      </div>

      {/* Kullanıcının Yaptığı Yorumlar */}
      <div className="mt-5">
        <h4>📝 Yaptığı Yorumlar</h4>
        {user.comments && user.comments.length > 0 ? (
          <div className="row">
            {user.comments.map((comment, index) => {
              const gameDetails = getGameDetailsByName(comment.gameName);
              const userRating = gameDetails?.ratings?.find(r => r.userId === user._id)?.rating;

              return (
                <div key={index} className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{comment.gameName}</h5>
                      <p className="card-text"><strong>Yorum:</strong> {comment.text || 'Yorum yok'}</p>
                      <p className="card-text"><strong>Oynama Süresi:</strong> {comment.playTime} saat</p>
                      <p className="card-text"><strong>Verdiği Puan:</strong> {userRating || 'Puan yok'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Bu kullanıcı henüz yorum yapmamış.</p>
        )}
      </div>
    </div>
    </div>
    </nav>
   </>
  );
}

export default UserProfilePage;

