import CrudPage from '../components/CrudPage';

export default function UsersPage() {
  return (
    <CrudPage
      title="Quản lý người dùng hệ thống"
      endpoint="/users"
      keyField="id"
      defaultCreateData={{ username: '', password: '', full_name: '', role: 'librarian', active: true }}
      createFields={[
        { name: 'username', label: 'Tên đăng nhập' },
        { name: 'password', label: 'Mật khẩu' },
        { name: 'full_name', label: 'Họ tên' },
        {
          name: 'role',
          label: 'Vai trò',
          type: 'select',
          options: [
            { value: 'admin', label: 'admin' },
            { value: 'librarian', label: 'librarian' }
          ]
        }
      ]}
      updateFields={[
        { name: 'id', label: 'ID' },
        { name: 'username', label: 'Tên đăng nhập' },
        { name: 'full_name', label: 'Họ tên' },
        {
          name: 'role',
          label: 'Vai trò',
          type: 'select',
          options: [
            { value: 'admin', label: 'admin' },
            { value: 'librarian', label: 'librarian' }
          ]
        },
        {
          name: 'active',
          label: 'Hoạt động',
          type: 'select',
          options: [{ value: true, label: 'true' }, { value: false, label: 'false' }]
        }
      ]}
      mapRow={(x) => ({ ...x })}
      normalizeUpdate={(x) => ({ full_name: x.full_name, role: x.role, active: String(x.active) === 'true' || x.active === true })}
      readOnlyFields={['id', 'username']}
    />
  );
}
