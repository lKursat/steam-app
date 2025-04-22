import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Kullanıcıları çekme hatası:", err));
  }, []);

  return (
<div className="container mt-5">
  <h2 className="mb-3">👥 Kullanıcılar</h2>
  <ul className="list-group">
    {users.map((user) => (
      <li key={user._id} className="list-group-item">
        <Link to={`/user/${user._id}`} className="text-decoration-none">
          {user.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

  );
}

export default UsersPage;
