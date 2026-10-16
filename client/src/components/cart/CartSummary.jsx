import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

function CartSummary({ subtotal, totalSavings, itemCount }) {
  const deliveryFee = 0; // flat free delivery for now; revisit in Phase 6 if needed
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-card border border-ink-300/50 bg-white p-5 sticky top-20">
      <h3 className="text-sm font-semibold text-ink-900 mb-4">Order Summary</h3>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-ink-700">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-success">
            <span>You save</span>
            <span>{formatCurrency(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink-700">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}</span>
        </div>
      </div>

      <div className="flex justify-between text-base font-semibold text-ink-900 mt-4 pt-4 border-t border-ink-300/40">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <Link
        to="/checkout"
        className="block text-center mt-5 py-3 rounded-full bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default CartSummary;