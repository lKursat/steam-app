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
    <div style={{ padding: '30px' }}>
      <h2>🎮 Oyunlar</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {games.map((game) => (
          <div
            key={game._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              width: '250px',
              textAlign: 'center',
              boxShadow: '2px 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <img src={game.photo} alt={game.name} style={{ width: '100%', borderRadius: '8px' }} />
            <h3>{game.name}</h3>
            <p><strong>Tür:</strong> {game.genres.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;
