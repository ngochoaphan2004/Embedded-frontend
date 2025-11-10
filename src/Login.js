// src/pages/Login.js
import React, { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import Header2 from './components/Header2';
import Footer from './components/Footer';
import api from './services/api';
function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await api.post('/api/login',{
      username: username,
      password: password
    })
    const res_data = res.data;
    
    console.log(res_data);
    

    if (res_data.success) {
      document.cookie = "tk=" + res_data.data + ";";
      setError('');
      onLoginSuccess();
      navigate('/dashboard');
    } else {
      setError(res_data.message);
    }
  };

  return (
    <>
      <Header2 />

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 136px)' }}>
        {/* 136px = chiều cao Header + Footer giả định */}
        <div className="card p-4 shadow-sm" style={{ maxWidth: 400, width: '100%' }}>
          <h2 className="mb-4 text-center">Đăng nhập</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">User name</label>
              <input
                id="inputEmail"
                type="string"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Nhập email"
                autoComplete="username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword" className="form-label">Mật khẩu</label>
              <input
                id="inputPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;
