import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Minus, Plus, Star, Check, PackageX } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { formatCurrency, calcDiscountPercent } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/ui/EmptyState';

const FALLBACK_IMG = '/images/products/placeholder.jpg';

function ProductDetails() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addItem, items } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { show } = useToast();

  useEffect(() => {
    let ignore = false;

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/products/${id}`);
        console.log('DEBUG-product response:',res.data);
        const p = { ...res.data.product, id: res.data.product._id, category: res.data.product.category?.slug };
        if (!ignore) setProduct(p);

        const relRes = await axiosClient.get('/products', { params: { category: p.category, limit: 5 } });
        console.log('Debug - RELATED RESPONSE:',relRes.data);
        if (!ignore) {
          setRelated(
            relRes.data.products
              .filter((r) => r._id !== p.id)
              .slice(0, 4)
              .map((r) => ({ ...r, id: r._id, category: r.category?.slug || r.category }))
          );
        }
      } catch(err) {
        console.log('DEBUG - error:',err)
        if (!ignore) setProduct(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProduct();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-ink-500">Loading...</div>;

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <EmptyState icon={PackageX} title="Product not found" subtitle="This product may have been removed." />
      </div>
    );
  }

  const discount = calcDiscountPercent(product.price, product.mrp);
  const inCart = items.some((i) => i.id === product.id);
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart() {
    addItem(product, qty);
    show(`${product.name} added to cart`);
  }

  function handleWishlist() {
    toggleItem(product);
    show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-card overflow-hidden bg-surface-bg">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-ink-900 mb-1">{product.name}</h1>
          <p className="text-sm text-ink-500 mb-3">{product.brand} • {product.unit}</p>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-4">
              <Star size={14} className="fill-warning text-warning" />
              <span className="text-sm text-ink-700">{product.rating}</span>
              <span className="text-sm text-ink-500">({product.reviewCount} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-bold text-ink-900">{formatCurrency(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-sm text-ink-500 line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-sm font-medium text-success">{discount}% off</span>
              </>
            )}
          </div>

          {product.stock > 0 ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-ink-300/60 rounded-full">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5" aria-label="Decrease quantity">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2.5" aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-ink-500">{product.stock} in stock</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-colors ${
                    inCart ? 'bg-success/10 text-success' : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}
                >
                  {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                  {inCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlist}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="w-12 h-12 rounded-full border border-ink-300/60 flex items-center justify-center hover:bg-surface-bg"
                >
                  <Heart size={18} className={wishlisted ? 'fill-danger text-danger' : ''} />
                </button>
              </div>
            </>
          ) : (
            <span className="inline-block px-4 py-2 rounded-full bg-ink-300/30 text-ink-500 text-sm font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
