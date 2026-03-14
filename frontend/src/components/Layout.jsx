import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Tổng quan', icon: '⌂' },
  { to: '/readers', label: 'Độc giả', icon: '◌' },
  { to: '/categories', label: 'Chuyên ngành', icon: '◈' },
  { to: '/titles', label: 'Đầu sách', icon: '∥' },
  { to: '/copies', label: 'Bản sao', icon: '⎘' },
  { to: '/loans', label: 'Mượn/Trả sách', icon: '↹' },
  { to: '/reports', label: 'Báo cáo', icon: '◫' }
];

export default function Layout({ user, children }) {
  const navigate = useNavigate();
  const roleLabel = user?.role === 'admin' ? 'Quản trị' : 'Thủ thư';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">📖</div>
          <div>
            <h3>Thư Viện</h3>
            <p>Quản lý Thư viện ĐH</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/users" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <span className="sidebar-icon">⚙</span>
              Người dùng
            </NavLink>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">{(user?.full_name || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.full_name}</strong>
              <p>{roleLabel}</p>
            </div>
          </div>
          <button className="logout-link" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="app-main">
        <div className="content-frame">{children}</div>
      </main>
    </div>
  );
}
