import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { checkoutSchema } from '../utils/validators';
import { useCart } from '../hooks/useCart';
import axiosClient from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';

function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  async function onSubmit(data) {
    setServerError('');
    setSubmitting(true);
    try {
      const res = await axiosClient.post('/orders', {
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          line1: data.line1,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
      });

      clearCart();
      navigate(`/order-confirmation/${res.data.order._id}`);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-ink-900 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-ink-900">Delivery Address</h2>

          <div>
            <label className="block text-xs text-ink-500 mb-1.5">Full Name</label>
            <input {...register('fullName')} className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500" />
            {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-ink-500 mb-1.5">Phone Number</label>
            <input {...register('phone')} className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500" />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-ink-500 mb-1.5">Address</label>
            <input {...register('line1')} className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500" />
            {errors.line1 && <p className="text-xs text-danger mt-1">{errors.line1.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-ink-500 mb-1.5">City</label>
              <input {...register('city')} className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500" />
              {errors.city && <p className="text-xs text-danger mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-ink-500 mb-1.5">State</label>
              <input {...register('state')} className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500" />
              {errors.state && <p className="text-xs text-danger mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="w-1/2">
            <label className="block text-xs text-ink-500 mb-1.5">PIN Code</label>
            <input {...register('pincode')} className="w-full px-4 py-2.5 rounded-lg border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500" />
            {errors.pincode && <p className="text-xs text-danger mt-1">{errors.pincode.message}</p>}
          </div>

          <div className="mt-2 p-4 rounded-lg bg-surface-bg text-sm text-ink-700">
            Payment Method: <strong>Cash on Delivery</strong>
          </div>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? 'Placing order...' : `Place Order — ${formatCurrency(subtotal)}`}
          </Button>
        </form>

        <div className="rounded-card border border-ink-300/50 bg-white p-5 h-fit">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Order Items</h3>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm py-2 border-b border-ink-300/30 last:border-0">
              <span className="text-ink-700">{i.name} × {i.qty}</span>
              <span className="font-medium text-ink-900">{formatCurrency(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-semibold text-ink-900 mt-4 pt-3 border-t border-ink-300/40">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;