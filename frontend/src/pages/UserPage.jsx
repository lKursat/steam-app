import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UserPage() {
  const { id } = useParams(); // URL'den userId al
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Kullanıcı bilgisi alınamadı:", err));
  }, [id]);

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: '30px' }}>
      <h2>👤 {user.name}</h2>
      <p><strong>Toplam Oynama:</strong> {user.totalPlayTime} saat</p>
      <p><strong>Ortalama Puan:</strong> {user.averageRating}</p>
      <p><strong>En Çok Oynadığı Oyun:</strong> {user.mostPlayedGame}</p>

      <h3>💬 Yorumları</h3>
      <ul>
        {user.comments && user.comments.length > 0 ? (
          user.comments.map((comment, index) => (
            <li key={index}>
              <strong>{comment.gameName}</strong>: {comment.text} ({comment.playTime} saat oynandı)
            </li>
          ))
        ) : (
          <p>Henüz yorum yapmamış.</p>
        )}
      </ul>
    </div>
  );
}

export default UserPage;
