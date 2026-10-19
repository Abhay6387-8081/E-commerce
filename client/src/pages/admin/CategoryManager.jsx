import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../hooks/useToast';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { show } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await axiosClient.get('/categories');
    setCategories(res.data.categories);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
      await axiosClient.post('/categories', { name: name.trim(), slug });
      setName('');
      show('Category added');
      fetchCategories();
    } catch (err) {
      show(err.response?.data?.error || 'Could not add category', 'error');
    }
  }

  async function handleDelete() {
    try {
      await axiosClient.delete(`/categories/${deleteTarget._id}`);
      show('Category deleted');
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    } catch {
      show('Could not delete category', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-ink-900 mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 max-w-xs px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
        />
        <Button type="submit"><Plus size={16} /> Add</Button>
      </form>

      <DataTable columns={['Name', 'Slug', '']}>
        {categories.map((c) => (
          <tr key={c._id} className="border-b border-ink-300/20 last:border-0">
            <td className="px-4 py-3">{c.name}</td>
            <td className="px-4 py-3 text-ink-500">{c.slug}</td>
            <td className="px-4 py-3">
              <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-ink-500 hover:text-danger float-right">
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Products in this category will keep an invalid reference — reassign them first.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default CategoryManager;