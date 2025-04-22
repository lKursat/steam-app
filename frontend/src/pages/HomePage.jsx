import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
<div className="container text-center mt-5">
  <h1 className="mb-4">🎮 Hoş Geldin!</h1>
  <p className="lead">Bu 3 oenin oyun platformu projesidir.</p>
  <Link to="/games" className="btn btn-primary m-2">Oyunları Gör</Link>
  <Link to="/users" className="btn btn-outline-secondary m-2">Kullanıcıları Gör</Link>
</div>

  );
}

export default HomePage;
