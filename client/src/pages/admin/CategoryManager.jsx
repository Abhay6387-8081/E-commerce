import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../hooks/useToast';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

function generateSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const { show } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await axiosClient.get('/categories');
    setCategories(res.data.categories);
  }

  function handleNameChange(value) {
    setName(value);
    if (!slugEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value) {
    setSlug(generateSlug(value));
    setSlugEdited(true);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!name.trim()) {
      show('Pehle category ka naam bharein, phir image upload karein', 'error');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', name);

      const res = await axiosClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImageUrl(res.data.imageUrl);
      show('Image uploaded');
    } catch (err) {
      show(err.response?.data?.error || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setName('');
    setSlug('');
    setSlugEdited(false);
    setImageUrl('');
    setEditTarget(null);
  }

  function startEdit(category) {
    setEditTarget(category);
    setName(category.name);
    setSlug(category.slug);
    setSlugEdited(true);
    setImageUrl(category.imageUrl || '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      show('Naam aur slug dono zaroori hain', 'error');
      return;
    }

    try {
      if (editTarget) {
        await axiosClient.put(`/categories/${editTarget._id}`, { name: name.trim(), slug, imageUrl });
        show('Category updated');
      } else {
        if (!imageUrl) {
          show('Category ke liye image upload karein', 'error');
          return;
        }
        await axiosClient.post('/categories', { name: name.trim(), slug, imageUrl });
        show('Category added');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      show(err.response?.data?.error || 'Could not save category', 'error');
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

      <form onSubmit={handleSubmit} className="rounded-card border border-ink-300/50 bg-white p-5 mb-6 max-w-md">
        <h2 className="text-sm font-semibold text-ink-900 mb-4">{editTarget ? 'Edit Category' : 'Add Category'}</h2>

        <div className="mb-4">
          <label className="block text-xs text-ink-500 mb-1.5">Category Name</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Atta & Flour"
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs text-ink-500 mb-1.5">
            Slug <span className="text-ink-400">(URL mein yeh use hoga — chaho to edit kar sakte ho)</span>
          </label>
          <input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="atta-and-flour"
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm font-mono"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs text-ink-500 mb-1.5">Category Image</label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-ink-300/60" />
            ) : (
              <div className="w-16 h-16 rounded-lg border border-dashed border-ink-300/60 flex items-center justify-center text-ink-500 text-[10px] text-center">
                No image
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="text-sm"
              />
              {uploading && <p className="text-xs text-ink-500 mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={uploading}>
            <Plus size={16} /> {editTarget ? 'Update Category' : 'Add Category'}
          </Button>
          {editTarget && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <DataTable columns={['Image', 'Name', 'Slug', '']}>
        {categories.map((c) => (
          <tr key={c._id} className="border-b border-ink-300/20 last:border-0">
            <td className="px-4 py-3">
              <img
                src={c.imageUrl}
                alt={c.name}
                onError={(e) => { e.currentTarget.src = '/images/products/placeholder.jpg'; }}
                className="w-10 h-10 object-cover rounded-lg border border-ink-300/60"
              />
            </td>
            <td className="px-4 py-3">{c.name}</td>
            <td className="px-4 py-3 text-ink-500 font-mono text-xs">{c.slug}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2 justify-end">
                <button onClick={() => startEdit(c)} className="p-1.5 text-ink-500 hover:text-brand-600">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-ink-500 hover:text-danger">
                  <Trash2 size={15} />
                </button>
              </div>
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