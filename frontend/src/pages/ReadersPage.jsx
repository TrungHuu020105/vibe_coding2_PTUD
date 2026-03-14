import CrudPage from '../components/CrudPage';

export default function ReadersPage() {
  return (
    <CrudPage
      title="Quản lý độc giả"
      endpoint="/readers"
      keyField="reader_id"
      defaultCreateData={{ reader_id: '', full_name: '', class_name: '', dob: '', gender: 'Nam', active: true }}
      createFields={[
        { name: 'reader_id', label: 'Mã độc giả' },
        { name: 'full_name', label: 'Họ tên' },
        { name: 'class_name', label: 'Lớp' },
        { name: 'dob', label: 'Ngày sinh', type: 'date' },
        { name: 'gender', label: 'Giới tính' }
      ]}
      updateFields={[
        { name: 'reader_id', label: 'Mã độc giả' },
        { name: 'full_name', label: 'Họ tên' },
        { name: 'class_name', label: 'Lớp' },
        { name: 'dob', label: 'Ngày sinh', type: 'date' },
        { name: 'gender', label: 'Giới tính' },
        {
          name: 'active',
          label: 'Hoạt động',
          type: 'select',
          options: [{ value: true, label: 'true' }, { value: false, label: 'false' }]
        }
      ]}
      mapRow={(x) => ({ ...x })}
      normalizeCreate={(x) => ({ ...x, active: true })}
      normalizeUpdate={(x) => ({ ...x, active: String(x.active) === 'true' || x.active === true })}
      readOnlyFields={['reader_id']}
    />
  );
}
