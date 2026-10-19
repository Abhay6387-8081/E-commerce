import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { show } = useToast();


  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axiosClient.get('/products?limit=100');
      setProducts(res.data.products);
    } catch {
      show('Could not load products', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete() {
    try {
      await axiosClient.delete(`/products/${deleteTarget._id}`);
      show('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    } catch {
      show('Could not delete product', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-ink-900">Products</h1>
        <Link to="/admin/products/new">
          <Button><Plus size={16} /> Add Product</Button>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-64 rounded-card" />
      ) : (
        <DataTable columns={['Name', 'Category', 'Price', 'Stock', 'Status', '']}>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-ink-300/20 last:border-0">
              <td className="px-4 py-3">{p.name}</td>
              <td className="px-4 py-3 text-ink-500">{p.category?.name || '—'}</td>
              <td className="px-4 py-3">{formatCurrency(p.price)}</td>
              <td className="px-4 py-3">
                <span className={p.stock <= 5 ? 'text-danger font-medium' : ''}>{p.stock}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-success/10 text-success' : 'bg-ink-300/30 text-ink-500'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <Link to={`/admin/products/${p._id}/edit`} className="p-1.5 text-ink-500 hover:text-brand-600">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-ink-500 hover:text-danger">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default ProductManager;