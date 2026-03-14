import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const statusLabel = {
  borrowed: 'Đang mượn',
  returned: 'Đã trả',
  late: 'Quá hạn'
};

export default function DashboardPage({ user }) {
  const [stats, setStats] = useState({ readers: 0, titles: 0, copies: 0, borrowing: 0 });
  const [loans, setLoans] = useState([]);
  const displayName = user?.full_name === 'Quan tri he thong' ? 'Quản trị hệ thống' : user?.full_name;

  useEffect(() => {
    (async () => {
      const [readersRes, titlesRes, copiesRes, loansRes] = await Promise.all([
        api.get('/readers'),
        api.get('/titles'),
        api.get('/copies'),
        api.get('/loans')
      ]);

      const activeLoans = loansRes.data.filter((x) => x.status === 'borrowed' || x.status === 'late');
      setStats({
        readers: readersRes.data.length,
        titles: titlesRes.data.length,
        copies: copiesRes.data.length,
        borrowing: activeLoans.length
      });
      setLoans(loansRes.data.slice(0, 6));
    })();
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Độc giả', value: stats.readers, icon: '◌', type: 'warn' },
      { label: 'Đầu sách', value: stats.titles, icon: '📘', type: 'base' },
      { label: 'Bản sao', value: stats.copies, icon: '⎘', type: 'base' },
      { label: 'Đang mượn', value: stats.borrowing, icon: '△', type: 'danger' }
    ],
    [stats]
  );

  return (
    <div>
      <section className="overview-head card">
        <h2>Tổng quan</h2>
        <p>Chào mừng {displayName} đến hệ thống quản lý thư viện</p>
      </section>

      <section className="dashboard-stats">
        {cards.map((item) => (
          <article key={item.label} className="stat-card">
            <div className="stat-top">
              <span>{item.label}</span>
              <span className={`stat-icon ${item.type}`}>{item.icon}</span>
            </div>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="card">
        <h3>Phiếu mượn gần đây</h3>
        <table>
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Mã độc giả</th>
              <th>Mã sách</th>
              <th>Ngày mượn</th>
              <th>Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 && (
              <tr>
                <td colSpan={5}>Chưa có dữ liệu phiếu mượn.</td>
              </tr>
            )}
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.reader_id}</td>
                <td>{loan.copy_id}</td>
                <td>{loan.borrow_date}</td>
                <td>
                  <span className={`status-pill ${loan.status}`}>{statusLabel[loan.status] || loan.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
