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
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı',
        text: 'Lütfen bir kullanıcı seçin!',
        background: '#1a1a1a',
        color: 'white',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }
    
    localStorage.setItem('loggedInUserId', selectedUserId);
    Swal.fire({
      icon: 'success',
      title: 'Başarılı',
      text: 'Giriş yapıldı!',
      background: '#1a1a1a',
      color: 'white',
      confirmButtonColor: '#0d6efd'
    }).then(() => {
      navigate('/');
    });
  };

    return (
      <div className="bg-dark text-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              
              {/* Login Card */}
              <div className="glassmorphism-card p-5 rounded-4 shadow-lg">
                
                {/* Logo Eklendi */}
                <div className="text-center mb-4">
                  <img
                    src="/logo.png"
                    alt="Site Logosu"
                    style={{ 
                      height: '80px',
                      filter: 'brightness(0.9) drop-shadow(0 0 8px rgba(255,255,255,0.2))'
                    }}
                    className="mb-3"
                  />
                </div>
  
                <div className="text-center mb-5">
                  <i className="bi bi-person-circle display-1 text-primary mb-3"></i>
                  <h1 className="h2 fw-bold mb-3">Hesabınıza Giriş Yapın</h1>
                  <p className="text-muted-white">Lütfen listeden kullanıcınızı seçin</p>
                </div>
  
                <div className="mb-4">
                  <label className="form-label text-light mb-3 fs-5">
                    <i className="bi bi-person-fill me-2"></i>
                    Kullanıcı Seçin
                  </label>
                  <select
                    className="form-select bg-dark text-light border-secondary py-3 custom-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={{ fontSize: '1.1rem' }}
                  >
                    <option value="" className="bg-secondary text-light">
                      -- Seçiniz --
                    </option>
                    {users.map((user) => (
                      <option 
                        key={user._id} 
                        value={user._id}
                        className="bg-dark text-light hover-option"
                      >
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                onClick={handleLogin} 
                className="btn btn-primary w-100 py-3 fw-bold hover-effect"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Giriş Yap
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default LoginPage;