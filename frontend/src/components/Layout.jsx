import { Link, useNavigate } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/readers', label: 'Độc giả' },
  { to: '/categories', label: 'Chuyên ngành' },
  { to: '/titles', label: 'Đầu sách' },
  { to: '/copies', label: 'Bản sao' },
  { to: '/loans', label: 'Mượn/Trả' },
  { to: '/reports', label: 'Báo cáo' }
];

export default function Layout({ user, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <header className="topbar">
        <h1>Library Management</h1>
        <div className="userinfo">
          <span>{user?.full_name} ({user?.role})</span>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </header>

      <nav className="menu">
        {links.map((item) => (
          <Link key={item.to} to={item.to}>{item.label}</Link>
        ))}
        {user?.role === 'admin' && <Link to="/users">Người dùng</Link>}
      </nav>

      <main className="container">{children}</main>
    </div>
  );
}
