import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function OrderDetailAdmin() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    axiosClient.get(`/orders/${id}`).then((res) => setOrder(res.data.order));
  }, [id]);

  async function updateStatus(status) {
    setUpdating(true);
    try {
      const res = await axiosClient.put(`/admin/orders/${id}/status`, { status });
      setOrder(res.data.order);
      show('Order status updated');
    } catch {
      show('Could not update status', 'error');
    } finally {
      setUpdating(false);
    }
  }

  if (!order) return <p className="text-ink-500 text-sm">Loading...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-ink-900 mb-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-sm text-ink-500 mb-6">{new Date(order.createdAt).toLocaleString('en-IN')}</p>

      <div className="rounded-card border border-ink-300/50 bg-white p-5 mb-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Items</h3>
        {order.items.map((i) => (
          <div key={i.product} className="flex justify-between text-sm py-2 border-b border-ink-300/30 last:border-0">
            <span>{i.name} × {i.qty}</span>
            <span className="font-medium">{formatCurrency(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between text-base font-semibold mt-4 pt-3 border-t border-ink-300/40">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="rounded-card border border-ink-300/50 bg-white p-5 mb-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Shipping Address</h3>
        <p className="text-sm">{order.shippingAddress.fullName} — {order.shippingAddress.phone}</p>
        <p className="text-sm">{order.shippingAddress.line1}</p>
        <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
      </div>

      <div className="rounded-card border border-ink-300/50 bg-white p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={updating || order.status === s}
              onClick={() => updateStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                order.status === s ? 'bg-brand-500 text-white' : 'bg-surface-bg text-ink-700 hover:bg-ink-300/30'
              } disabled:opacity-60`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailAdmin;