import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';

const STATUS_COLORS = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-brand-50 text-brand-600',
  shipped: 'bg-brand-50 text-brand-600',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchOrders() {
      try {
        const res = await axiosClient.get('/orders/my');
        if (!ignore) setOrders(res.data.orders);
      } catch {
        if (!ignore) setOrders([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchOrders();
    return () => { ignore = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full mb-3 rounded-card" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState icon={PackageOpen} title="No orders yet" subtitle="Your order history will appear here." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-ink-900 mb-6">My Orders</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="rounded-card border border-ink-300/50 bg-white p-4 flex items-center justify-between hover:shadow-card transition-shadow"
          >
            <div>
              <p className="text-sm font-medium text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-ink-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' • '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
              <span className="text-sm font-semibold text-ink-900">{formatCurrency(order.totalAmount)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;