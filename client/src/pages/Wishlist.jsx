import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatCurrency';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const FALLBACK_IMG = '/images/products/placeholder.jpg';

function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();

  function handleMoveToCart(product) {
    addItem(product, 1);
    removeItem(product.id);
    show(`${product.name} moved to cart`);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          subtitle="Save products you like for later."
          action={
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-ink-900 mb-6">My Wishlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <div key={product.id} className="rounded-card border border-ink-300/50 bg-white overflow-hidden">
            <Link to={`/products/${product.id}`} className="block aspect-square bg-surface-bg">
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="p-3">
              <Link to={`/products/${product.id}`} className="text-sm font-medium text-ink-900 line-clamp-2 mb-1 block">
                {product.name}
              </Link>
              <p className="text-sm font-semibold text-ink-900 mb-3">{formatCurrency(product.price)}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-brand-500 text-white text-xs font-medium hover:bg-brand-600"
                >
                  <ShoppingCart size={13} /> Move to Cart
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  aria-label="Remove from wishlist"
                  className="w-8 h-8 rounded-full border border-ink-300/60 flex items-center justify-center text-ink-500 hover:text-danger hover:border-danger"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;