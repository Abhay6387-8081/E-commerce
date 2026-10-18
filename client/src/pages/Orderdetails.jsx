import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';

const STATUS_COLORS = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-brand-50 text-brand-600',
  shipped: 'bg-brand-50 text-brand-600',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
};

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchOrder() {
      try {
        const res = await axiosClient.get(`/orders/${id}`);
        if (!ignore) setOrder(res.data.order);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.error || 'Could not load order.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchOrder();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-ink-500">Loading...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-danger">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-4">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="rounded-card border border-ink-300/50 bg-white p-5 mb-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Items</h3>
        {order.items.map((i) => (
          <div key={i.product} className="flex justify-between text-sm py-2 border-b border-ink-300/30 last:border-0">
            <span className="text-ink-700">{i.name} × {i.qty}</span>
            <span className="font-medium text-ink-900">{formatCurrency(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between text-base font-semibold text-ink-900 mt-4 pt-3 border-t border-ink-300/40">
          <span>Total (Cash on Delivery)</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="rounded-card border border-ink-300/50 bg-white p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Delivery Address</h3>
        <p className="text-sm text-ink-700">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-ink-700">{order.shippingAddress.phone}</p>
        <p className="text-sm text-ink-700">{order.shippingAddress.line1}</p>
        <p className="text-sm text-ink-700">
          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
        </p>
      </div>
    </div>
  );
}

export default OrderDetails;