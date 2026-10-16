import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const FALLBACK_IMG = '/images/products/placeholder.jpg';

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex gap-4 py-4 border-b border-ink-300/40">
      <Link to={`/products/${item.id}`} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-bg">
        <img
          src={item.imageUrl}
          alt={item.name}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.id}`} className="text-sm font-medium text-ink-900 line-clamp-1">
          {item.name}
        </Link>
        <p className="text-xs text-ink-500 mt-0.5">{item.unit}</p>
        <p className="text-sm font-semibold text-ink-900 mt-1">{formatCurrency(item.price)}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-ink-300/60 rounded-full">
            <button
              onClick={() => onUpdateQty(item.id, item.qty - 1)}
              disabled={item.qty <= 1}
              className="p-2 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-xs font-medium">{item.qty}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.qty + 1)}
              disabled={item.qty >= item.stock}
              className="p-2 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <button onClick={() => onRemove(item.id)} aria-label="Remove item" className="text-ink-500 hover:text-danger">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;