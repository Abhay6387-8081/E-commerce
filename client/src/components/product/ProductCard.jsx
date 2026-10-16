import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { formatCurrency, calcDiscountPercent } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../hooks/useToast';

const FALLBACK_IMG = '/images/products/placeholder.jpg';

function ProductCard({ product }) {
  const discount = calcDiscountPercent(product.price, product.mrp);
  const { addItem, items } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { show } = useToast();

  const inCart = items.some((i) => i.id === product.id);
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart(e) {
    e.preventDefault();
    addItem(product, 1);
    show(`${product.name} added to cart`);
  }

  function handleWishlist(e) {
    e.preventDefault();
    toggleItem(product);
    show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-card border border-ink-300/50 bg-white overflow-hidden hover:shadow-cardHover transition-shadow flex flex-col"
    >
      <div className="relative aspect-square bg-surface-bg">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-brand-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
        >
          <Heart size={15} className={wishlisted ? 'fill-danger text-danger' : 'text-ink-700'} />
        </button>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-ink-900 line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-xs text-ink-500 mb-2">{product.unit}</p>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-warning text-warning" />
            <span className="text-xs text-ink-500">{product.rating} ({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-sm font-semibold text-ink-900">{formatCurrency(product.price)}</span>
          {discount > 0 && (
            <span className="text-xs text-ink-500 line-through">{formatCurrency(product.mrp)}</span>
          )}
        </div>

        {product.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-full text-xs font-medium transition-colors ${
              inCart ? 'bg-success/10 text-success' : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
            {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
            {inCart ? 'Added' : 'Add to Cart'}
          </button>
        ) : (
          <span className="block text-center py-2 rounded-full bg-ink-300/30 text-ink-500 text-xs font-medium">
            Out of Stock
          </span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;