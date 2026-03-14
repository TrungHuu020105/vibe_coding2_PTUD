import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function ReportsPage() {
  const [topTitles, setTopTitles] = useState([]);
  const [unreturned, setUnreturned] = useState([]);

  useEffect(() => {
    (async () => {
      const [a, b] = await Promise.all([
        api.get('/reports/top-titles'),
        api.get('/reports/unreturned-readers')
      ]);
      setTopTitles(a.data);
      setUnreturned(b.data);
    })();
  }, []);

  return (
    <>
      <div className="card">
        <h2>Đầu sách cho mượn nhiều nhất</h2>
        <table>
          <thead><tr><th>Mã</th><th>Tên</th><th>Số lần mượn</th></tr></thead>
          <tbody>
            {topTitles.map((x) => (
              <tr key={x.title_id}><td>{x.title_id}</td><td>{x.name}</td><td>{x.borrow_count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Độc giả chưa trả sách</h2>
        <table>
          <thead><tr><th>Phiếu</th><th>Mã độc giả</th><th>Họ tên</th><th>Mã sách</th><th>Tên sách</th><th>Ngày mượn</th><th>Số ngày mượn</th></tr></thead>
          <tbody>
            {unreturned.map((x) => (
              <tr key={x.loan_id}><td>{x.loan_id}</td><td>{x.reader_id}</td><td>{x.reader_name}</td><td>{x.copy_id}</td><td>{x.title_name}</td><td>{x.borrow_date}</td><td>{x.days_open}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
