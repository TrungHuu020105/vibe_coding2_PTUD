import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ copy_id: '', reader_id: '', borrow_date: '', borrow_condition: 'Tot' });
  const [returnData, setReturnData] = useState({});
  const [error, setError] = useState('');

  const load = async () => {
    const response = await api.get('/loans');
    setLoans(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const borrow = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/loans', form);
      setForm({ copy_id: '', reader_id: '', borrow_date: '', borrow_condition: 'Tot' });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Không thể lập phiếu mượn');
    }
  };

  const returnBook = async (loanId) => {
    const payload = returnData[loanId] || { return_date: '', return_condition: 'Tot' };
    await api.post(`/loans/${loanId}/return`, payload);
    load();
  };

  return (
    <div className="card">
      <h2>Quản lý mượn trả</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={borrow} className="grid">
        <label>Mã sách<input value={form.copy_id} onChange={(e) => setForm({ ...form, copy_id: e.target.value })} required /></label>
        <label>Mã độc giả<input value={form.reader_id} onChange={(e) => setForm({ ...form, reader_id: e.target.value })} required /></label>
        <label>Ngày mượn<input type="date" value={form.borrow_date} onChange={(e) => setForm({ ...form, borrow_date: e.target.value })} required /></label>
        <label>Tình trạng lúc mượn<input value={form.borrow_condition} onChange={(e) => setForm({ ...form, borrow_condition: e.target.value })} required /></label>
        <button type="submit">Ghi nhận mượn</button>
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Mã sách</th><th>Mã độc giả</th><th>Ngày mượn</th><th>Ngày trả</th><th>Trạng thái</th><th>Trả sách</th></tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.copy_id}</td>
              <td>{l.reader_id}</td>
              <td>{l.borrow_date}</td>
              <td>{l.return_date || '-'}</td>
              <td>{l.status}</td>
              <td>
                {(l.status === 'borrowed' || l.status === 'late') ? (
                  <div>
                    <input
                      type="date"
                      onChange={(e) => setReturnData({
                        ...returnData,
                        [l.id]: { ...(returnData[l.id] || {}), return_date: e.target.value }
                      })}
                    />
                    <input
                      placeholder="Tốt/damaged/lost"
                      onChange={(e) => setReturnData({
                        ...returnData,
                        [l.id]: { ...(returnData[l.id] || {}), return_condition: e.target.value }
                      })}
                    />
                    <button onClick={() => returnBook(l.id)}>Trả</button>
                  </div>
                ) : 'Đã trả'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
