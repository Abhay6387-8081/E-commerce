import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatCurrency';
import DataTable from '../../components/admin/DataTable';
import Skeleton from '../../components/ui/Skeleton';

const STATUS_COLORS = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-brand-50 text-brand-600',
  shipped: 'bg-brand-50 text-brand-600',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
};

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await axiosClient.get('/admin/orders', { params });
      setOrders(res.data.orders);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-ink-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-ink-300/60 rounded-lg px-3 py-2"
        >
          <option value="">All Statuses</option>
          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Skeleton className="h-64 rounded-card" />
      ) : (
        <DataTable columns={['Order', 'Customer', 'Total', 'Status', 'Date']}>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-ink-300/20 last:border-0 hover:bg-surface-bg">
              <td className="px-4 py-3">
                <Link to={`/admin/orders/${o._id}`} className="text-brand-600 font-medium">
                  #{o._id.slice(-8).toUpperCase()}
                </Link>
              </td>
              <td className="px-4 py-3">{o.user?.name || '—'}</td>
              <td className="px-4 py-3">{formatCurrency(o.totalAmount)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
              </td>
              <td className="px-4 py-3 text-ink-500">
                {new Date(o.createdAt).toLocaleDateString('en-IN')}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default OrderManager;