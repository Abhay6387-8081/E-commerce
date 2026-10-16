import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

function Cart() {
  const { items, updateQty, removeItem, itemCount, subtotal, totalSavings } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          subtitle="Browse products and add items to your cart."
          action={
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-ink-900 mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} onUpdateQty={updateQty} onRemove={removeItem} />
          ))}
        </div>

        <div>
          <CartSummary subtotal={subtotal} totalSavings={totalSavings} itemCount={itemCount} />
        </div>
      </div>
    </div>
  );
}

export default Cart;