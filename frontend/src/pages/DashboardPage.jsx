export default function DashboardPage({ user }) {
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Xin chào {user?.full_name}. Chọn module trong menu để quản lý thư viện.</p>
      <ul>
        <li>Admin: quản lý tài khoản thủ thư</li>
        <li>Librarian: quản lý độc giả, sách, mượn/trả, báo cáo</li>
      </ul>
    </div>
  );
}
