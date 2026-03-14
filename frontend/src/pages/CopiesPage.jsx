import CrudPage from '../components/CrudPage';

export default function CopiesPage() {
  return (
    <CrudPage
      title="Quản lý bản sao sách"
      endpoint="/copies"
      keyField="copy_id"
      defaultCreateData={{ copy_id: '', title_id: '', status: 'available', acquired_date: '' }}
      createFields={[
        { name: 'copy_id', label: 'Mã sách' },
        { name: 'title_id', label: 'Mã đầu sách' },
        {
          name: 'status',
          label: 'Tình trạng',
          type: 'select',
          options: [
            { value: 'available', label: 'available' },
            { value: 'damaged', label: 'damaged' },
            { value: 'lost', label: 'lost' }
          ]
        },
        { name: 'acquired_date', label: 'Ngày nhập', type: 'date' }
      ]}
      updateFields={[
        { name: 'copy_id', label: 'Mã sách' },
        { name: 'title_id', label: 'Mã đầu sách' },
        {
          name: 'status',
          label: 'Tình trạng',
          type: 'select',
          options: [
            { value: 'available', label: 'available' },
            { value: 'borrowed', label: 'borrowed' },
            { value: 'damaged', label: 'damaged' },
            { value: 'lost', label: 'lost' },
            { value: 'removed', label: 'removed' }
          ]
        },
        { name: 'acquired_date', label: 'Ngày nhập', type: 'date' }
      ]}
      mapRow={(x) => ({ ...x })}
      readOnlyFields={['copy_id']}
    />
  );
}
