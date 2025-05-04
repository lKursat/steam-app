import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

function HomePage() {
  const [games, setGames] = useState([]);
  const [name, setName] = useState('');
  const [genres, setGenres] = useState('');
  const [photo, setPhoto] = useState('');
  const [developer, setDeveloper] = useState('');
  const [about, setAbout] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [userName, setUserName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState('');
  const [userAbout, setUserAbout] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 15;
  const genresList = ["Action", "Adventure", "Casual", "Indie", "Massively Multiplayer", "RPG", "Simulation", "Strategy"];
  const filteredGames = games.filter((game) => {
    const matchesGenre = selectedGenre ? game.genres.includes(selectedGenre) : true;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);




  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  useEffect(() => {
    fetchGames();
    if (loggedInUserId) {
      fetchLoggedInUser(loggedInUserId);
    }
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/games`);
      setGames(res.data);
    } catch (error) {
      console.error('Oyunları çekme hatası:', error);
    }
  };

  const fetchLoggedInUser = async (userId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`);
      setLoggedInUser(res.data);
    } catch (error) {
      console.error('Giriş yapan kullanıcı bilgisi alınamadı:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserId');
    setLoggedInUser(null);
    Swal.fire('Successfully logged out.', '', 'success').then(() => navigate('/'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/games`, {
        name,
        genres: genres.split(',').map(g => g.trim()),
        photo,
        optionalFields: { developer, releaseDate, about }
      });
      setName('');
      setGenres('');
      setPhoto('');
      setDeveloper('');
      setAbout('');
      setReleaseDate('');
      document.getElementById('closeModalButton').click();
      fetchGames();
      Swal.fire('Success!', 'Game Added.', 'success');
    } catch (error) {
      console.error('Game adding error:', error);
      Swal.fire('Error!', 'Game is not Added.', 'error');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
        name: userName,
        photo: userPhoto,
        about: userAbout
      });
      setUserName('');
      setUserPhoto('');
      setUserAbout('');
      document.getElementById('closeUserModalButton').click();
      Swal.fire({
        title: 'Başarılı!',
        text: 'User added successfully.',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Error adding user', error);
      Swal.fire({
        title: 'Hata!',
        text: 'Kullanıcı eklenemedi.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Bu oyunu silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/games/${id}`);
        fetchGames();
        Swal.fire('Success!', 'Game Deleted.', 'success');
      } catch (error) {
        console.error('Game Delete Error:', error);
        Swal.fire('Warning!', 'Game is not Deleted.', 'error');
      }
    }
  };

  const handleFavoriteToggle = async (gameId) => {
    if (!loggedInUserId) {
      Swal.fire('Warning!', 'Favori eklemek için giriş yapmalısınız.', 'warning');
      return;
    }
  
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${loggedInUserId}`);
      const userData = res.data;
  
      const favorites = userData.favorites || []; // favorites yoksa boş dizi kabul et
      const isFavorited = favorites.includes(gameId);
  
      if (isFavorited) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${loggedInUserId}/favorites/${gameId}`);
        Swal.fire('Success!', 'Favorilerden çıkarıldı.', 'success');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/${loggedInUserId}/favorites/${gameId}`);
        Swal.fire('Başarılı!', 'Favorilere eklendi.', 'success');
      }
  
      fetchGames();             // Listeyi güncelle
      fetchLoggedInUser(loggedInUserId); // Kullanıcı bilgisini güncelle
  
    } catch (error) {
      console.error('Favori işlem hatası:', error);
      Swal.fire('Hata!', 'Favori işlemi başarısız.', 'error');
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
  
          {/* Left - User Operations */}
          <div className="d-flex align-items-center gap-3">
            {loggedInUser ? (
              <>
                <Link
                  to={`/profile/${loggedInUser._id}`}
                  className="profile-hover-link d-flex align-items-center text-decoration-none"
                >
                  <img
                    src={loggedInUser.photo || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                    alt="Profile"
                    className="profile-image"
                  />
                  <span className="profile-label ms-2">Profile: {loggedInUser.name}</span>
                </Link>
  
                <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate('/login')}>Log In</button>
            )}
          </div>
  
          {/* Middle - Logo */}
          <div className="mx-3 text-center">
            <Link to="/" className="navbar-brand">
              <img src="/logo.png" alt="Site Logo" width="200" height="50" className="d-inline-block align-top" />
            </Link>
          </div>
  
          <div className="floating-buttons d-flex gap-2">
            {/* Add Game */}
            <button
              className="animated-btn"
              data-bs-toggle="modal"
              data-bs-target="#addGameModal"
              title="Add Game"
            >
              🎮
              <span className="btn-label">Add Game</span>
            </button>
  
            {/* Add User */}
            <button
              className="animated-btn"
              data-bs-toggle="modal"
              data-bs-target="#addUserModal"
              title="Add User"
            >
              👤
              <span className="btn-label">Add User</span>
            </button>
          </div>
  
        </div>
      </nav>
  
      <div className="container mt-4">
        <div className="row">
          {/* 🎮 Left Menu */}
          <div className="col-md-2 px-5">
            <h6 className="text-light text-uppercase fw-bold ms-2"> Game Categories</h6>
            <ul className="genre-filter ms-2 me-2">
              {genresList.map((genre) => (
                <li
                  key={genre}
                  className={`list-group-item genre-item ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </li>
              ))}
              <li
                className="list-group-item genre-item reset"
                onClick={() => setSelectedGenre(null)}
              >
                All Games
              </li>
            </ul>
          </div>
  
          {/* 🧩 Games Area */}
          <div className="col-md-10">
            {/* 🔍 Search Bar */}
            <div className="search-wrapper position-relative mb-4">
              <span className="search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary">
                🔍︎
              </span>
              <input
                type="text"
                className="form-control search-box ps-5 bg-dark text-light border-0"
                placeholder="Search for a game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
  
            {/* 🎴 Game Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentGames.map((game) => (
                <div key={game._id} className="col">
                  <div className="game-card position-relative overflow-hidden bg-dark text-light">
                    {/* Clickable part of the card */}
                    <Link to={`/game/${game._id}`} className="text-decoration-none text-white">
                      {/* Game image */}
                      <img
                        src={game.photo}
                        alt={game.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
  
                      {/* Content shown on hover */}
                      <div className="card-slide-content px-3 py-2">
                        <h5 className="text-info mb-1">{game.name}</h5>
                        <p className="small mb-0">{game.optionalFields?.about || "Description not available."}</p>
                      </div>
                    </Link>
  
                    {/* Favorite / Delete Buttons */}
                    <div className="card-icons position-absolute top-0 start-0 end-0 d-flex justify-content-between p-2">
                      <button
                        onClick={() => handleDelete(game._id)}
                        className="btn btn-sm icon-btn bg-dark text-white"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
  
                      <button
                        onClick={() => handleFavoriteToggle(game._id)}
                        className="btn btn-sm icon-btn bg-dark text-white"
                        title="Add / Remove from Favorites"
                      >
                        {loggedInUser?.favorites?.includes(game._id) ? (
                          <FaHeart color="red" />
                        ) : (
                          <FaRegHeart color="white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* 📄 Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination pagination-sm">
                  {Array.from({ length: Math.ceil(filteredGames.length / gamesPerPage) }).map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      {/* Add Game Modal */}
      <div className="modal fade" id="addGameModal" tabIndex="-1" aria-labelledby="addGameModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="addGameModalLabel">Add New Game</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Form Fields */}
                <div className="mb-3">
                  <label>Game Name</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label>Genres (separate by commas)</label>
                  <input type="text" className="form-control" value={genres} onChange={(e) => setGenres(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label>Image Link</label>
                  <input type="text" className="form-control" value={photo} onChange={(e) => setPhoto(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label>Developer</label>
                  <input type="text" className="form-control" value={developer} onChange={(e) => setDeveloper(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label>About Game</label>
                  <input type="text" className="form-control" value={about} onChange={(e) => setAbout(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label>Release Date (Optional)</label>
                  <input type="text" className="form-control" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" id="closeModalButton" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAddUser}>
              <div className="modal-header">
                <h5 className="modal-title" id="addUserModalLabel">Add New User</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Username */}
                <div className="mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required />
                </div>
  
                {/* Profile Picture */}
                <div className="mb-3">
                  <label>Profile Picture (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={userPhoto}
                    onChange={(e) => setUserPhoto(e.target.value)} />
                </div>
  
                {/* About Me */}
                <div className="mb-3">
                  <label>About Me</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="You can write a few sentences about yourself."
                    value={userAbout}
                    onChange={(e) => setUserAbout(e.target.value)} />
                </div>
              </div>
  
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" id="closeUserModalButton" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <footer className="navbar navbar-dark bg-black justify-content-center py-4 mt-5">
        <div className="d-flex flex-column align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src="/logo.png"
              alt="Footer Logo"
              style={{
                height: '40px',
                filter: 'brightness(0.8)'
              }} />
            <span
              className="text-muted-white"
              style={{
                fontFamily: 'Arial',
                fontSize: '1.2rem',
                letterSpacing: '1.2px'
              }}
            >
              GAME PLATFORM
            </span>
          </div>
  
          <div className="text-center">
            <p className="mb-1 text-secondary">
              © {new Date().getFullYear()} All rights reserved.
            </p>
            <p className="mb-0 text-secondary">
              Project product.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
  
}

export default HomePage;
