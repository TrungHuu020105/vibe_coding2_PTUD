import { useEffect, useState } from 'react';
import { api } from '../api/client';

const deepClone = (v) => JSON.parse(JSON.stringify(v));

export default function CrudPage({
  title,
  endpoint,
  keyField,
  createFields,
  updateFields,
  defaultCreateData,
  mapRow,
  normalizeCreate,
  normalizeUpdate,
  readOnlyFields = []
}) {
  const [rows, setRows] = useState([]);
  const [createData, setCreateData] = useState(defaultCreateData);
  const [error, setError] = useState('');

  const load = async () => {
    const response = await api.get(endpoint);
    setRows(response.data.map((item) => ({ ...mapRow(item), __editing: deepClone(mapRow(item)) })));
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(endpoint, normalizeCreate ? normalizeCreate(createData) : createData);
      setCreateData(defaultCreateData);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Lỗi tạo dữ liệu');
    }
  };

  const onSave = async (item) => {
    const payload = normalizeUpdate ? normalizeUpdate(item.__editing) : item.__editing;
    await api.put(`${endpoint}/${item[keyField]}`, payload);
    load();
  };

  const onDelete = async (item) => {
    await api.delete(`${endpoint}/${item[keyField]}`);
    load();
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onCreate} className="grid">
        {createFields.map((field) => (
          <label key={field.name}>
            {field.label}
            {field.type === 'select' ? (
              <select
                value={createData[field.name]}
                onChange={(e) => setCreateData({ ...createData, [field.name]: e.target.value })}
              >
                {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={createData[field.name]}
                onChange={(e) => setCreateData({ ...createData, [field.name]: e.target.value })}
                required={field.required !== false}
              />
            )}
          </label>
        ))}
        <button type="submit">Thêm</button>
      </form>

      <table>
        <thead>
          <tr>
            {updateFields.map((f) => <th key={f.name}>{f.label}</th>)}
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item[keyField]}>
              {updateFields.map((field) => {
                const ro = readOnlyFields.includes(field.name);
                return (
                  <td key={field.name}>
                    {field.type === 'select' && !ro ? (
                      <select
                        value={item.__editing[field.name]}
                        onChange={(e) => {
                          item.__editing[field.name] = e.target.value;
                          setRows([...rows]);
                        }}
                      >
                        {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={item.__editing[field.name] ?? ''}
                        readOnly={ro}
                        onChange={(e) => {
                          item.__editing[field.name] = e.target.value;
                          setRows([...rows]);
                        }}
                      />
                    )}
                  </td>
                );
              })}
              <td>
                <button onClick={() => onSave(item)}>Lưu</button>
                <button onClick={() => onDelete(item)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
