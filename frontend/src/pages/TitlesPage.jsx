import CrudPage from '../components/CrudPage';

export default function TitlesPage() {
  return (
    <CrudPage
      title="Quản lý đầu sách"
      endpoint="/titles"
      keyField="title_id"
      defaultCreateData={{ title_id: '', name: '', publisher: '', page_count: 1, size: '', author: '', category_id: '' }}
      createFields={[
        { name: 'title_id', label: 'Mã đầu sách' },
        { name: 'name', label: 'Tên đầu sách' },
        { name: 'publisher', label: 'Nhà xuất bản' },
        { name: 'page_count', label: 'Số trang', type: 'number' },
        { name: 'size', label: 'Kích thước' },
        { name: 'author', label: 'Tác giả' },
        { name: 'category_id', label: 'Mã chuyên ngành' }
      ]}
      updateFields={[
        { name: 'title_id', label: 'Mã đầu sách' },
        { name: 'name', label: 'Tên đầu sách' },
        { name: 'publisher', label: 'Nhà xuất bản' },
        { name: 'page_count', label: 'Số trang', type: 'number' },
        { name: 'size', label: 'Kích thước' },
        { name: 'author', label: 'Tác giả' },
        { name: 'category_id', label: 'Mã chuyên ngành' },
        { name: 'quantity', label: 'Số lượng' }
      ]}
      mapRow={(x) => ({ ...x })}
      normalizeCreate={(x) => ({ ...x, page_count: Number(x.page_count) })}
      normalizeUpdate={(x) => ({
        name: x.name,
        publisher: x.publisher,
        page_count: Number(x.page_count),
        size: x.size,
        author: x.author,
        category_id: x.category_id
      })}
      readOnlyFields={['title_id', 'quantity']}
    />
  );
}
