import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchOrder() {
      try {
        const res = await axiosClient.get(`/orders/${id}`);
        if (!ignore) setOrder(res.data.order);
      } catch {
        if (!ignore) setOrder(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchOrder();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-ink-500">Loading...</div>;
  if (!order) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-ink-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
      <h1 className="text-xl font-bold text-ink-900 mb-2">Order Placed Successfully</h1>
      <p className="text-sm text-ink-500 mb-8">Order ID: {order._id}</p>

      <div className="rounded-card border border-ink-300/50 bg-white p-6 text-left mb-8">
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

      <div className="flex gap-3 justify-center">
        <Link to="/orders"><Button variant="secondary">View My Orders</Button></Link>
        <Link to="/products"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;