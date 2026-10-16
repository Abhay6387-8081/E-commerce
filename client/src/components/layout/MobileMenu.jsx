import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Orders', to: '/orders' },
  { label: 'Login', to: '/login' },
];

function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-white p-5 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold text-ink-900">Menu</span>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-ink-300/60 text-sm"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="px-3 py-2.5 rounded-lg text-sm text-ink-700 hover:bg-surface-bg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;