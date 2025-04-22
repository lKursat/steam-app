import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GamesPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/games`)
      .then((res) => setGames(res.data))
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, []);

  return (
<div className="container mt-5">
  <h2 className="mb-4">🎮 Oyunlar</h2>
  <div className="row">
    {games.map((game) => (
      <div key={game._id} className="col-md-4 mb-4">
        <div className="card h-100">
          <img src={game.photo} className="card-img-top" alt={game.name} />
          <div className="card-body">
            <h5 className="card-title">{game.name}</h5>
            <p className="card-text">Türler: {game.genres.join(', ')}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

export default GamesPage;
