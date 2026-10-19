import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';

const emptyForm = {
  name: '', brand: 'Generic', description: '', category: '', price: '', mrp: '',
  unit: '', stock: '', imageUrl: '', isActive: true, isFeatured: false, isBestSeller: false,
};

function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { show } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    axiosClient.get(`/products/${id}`).then((res) => {
      const p = res.data.product;
      setForm({
        ...p,
        category: p.category?._id || p.category,
      });
    });
  }, [id, isEdit]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
      };
      if (isEdit) {
        await axiosClient.put(`/products/${id}`, payload);
        show('Product updated');
      } else {
        await axiosClient.post('/products', payload);
        show('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-ink-900 mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Name</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm" />
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Category</label>
          <select value={form.category} onChange={(e) => update('category', e.target.value)} required
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ink-500 mb-1.5">Price (₹)</label>
            <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-ink-500 mb-1.5">MRP (₹)</label>
            <input type="number" value={form.mrp} onChange={(e) => update('mrp', e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ink-500 mb-1.5">Unit (e.g. 1 kg)</label>
            <input value={form.unit} onChange={(e) => update('unit', e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-ink-500 mb-1.5">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={form.isBestSeller} onChange={(e) => update('isBestSeller', e.target.checked)} />
            Best Seller
          </label>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </div>
  );
}

export default ProductForm;