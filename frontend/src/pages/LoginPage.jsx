import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.access_token);
      onLoginSuccess();
      navigate('/dashboard');
    } catch {
      setError('Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-hero">
        <div className="login-hero-icon">📖</div>
        <h1>Thư Viện Đại Học</h1>
        <p>Hệ thống Quản lý Thư viện</p>
      </div>

      <form className="login-panel" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        {error && <p className="error">{error}</p>}

        <label className="login-label">
          Tên đăng nhập
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
        </label>

        <label className="login-label">
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" className="login-submit">Đăng nhập</button>

        <div className="login-demo-box">
          <strong>Tài khoản demo:</strong>
          <p>Admin: <code>admin</code> / <code>admin123</code></p>
          <p>Thủ thư: <code>thuthu1</code> / <code>123456</code></p>
        </div>
      </form>
    </div>
  );
}
