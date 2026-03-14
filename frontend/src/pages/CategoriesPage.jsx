import CrudPage from '../components/CrudPage';

export default function CategoriesPage() {
  return (
    <CrudPage
      title="Quản lý chuyên ngành"
      endpoint="/categories"
      keyField="category_id"
      defaultCreateData={{ category_id: '', name: '', description: '' }}
      createFields={[
        { name: 'category_id', label: 'Mã chuyên ngành' },
        { name: 'name', label: 'Tên chuyên ngành' },
        { name: 'description', label: 'Mô tả', required: false }
      ]}
      updateFields={[
        { name: 'category_id', label: 'Mã chuyên ngành' },
        { name: 'name', label: 'Tên chuyên ngành' },
        { name: 'description', label: 'Mô tả', required: false }
      ]}
      mapRow={(x) => ({ ...x })}
      readOnlyFields={['category_id']}
    />
  );
}
