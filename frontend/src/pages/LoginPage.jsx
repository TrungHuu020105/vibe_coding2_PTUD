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
    <div className="login-wrap">
      <form className="card login" onSubmit={handleSubmit}>
        <h2>Đăng nhập hệ thống thư viện</h2>
        {error && <p className="error">{error}</p>}
        <label>Tên đăng nhập<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
        <label>Mật khẩu<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
