import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function LoginPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Kullanıcıları çekme hatası:', error);
    }
  };

  const handleLogin = () => {
    if (!selectedUserId) {
      Swal.fire('Uyarı', 'Lütfen bir kullanıcı seçin!', 'warning');
      return;
    }
    // Kullanıcıyı LocalStorage'a kaydet
    localStorage.setItem('loggedInUserId', selectedUserId);
    Swal.fire('Başarılı', 'Giriş yapıldı!', 'success').then(() => {
      navigate('/'); // Ana sayfaya yönlendir
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🔐 Kullanıcı Girişi</h2>

      <div className="mb-3">
        <label>Kullanıcı Seçin:</label>
        <select
          className="form-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Seçiniz --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleLogin} className="btn btn-primary">
        Giriş Yap
      </button>
    </div>
  );
}

export default LoginPage;
