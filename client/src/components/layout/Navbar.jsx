import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import storeConfig from '../../config/storeConfig';
import MobileMenu from './MobileMenu';
import {useCart} from '../../hooks/useCart';
import {useAuthContext} from '../../hooks/useAuthContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {itemCount} = useCart();
  const {user} = useAuthContext();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-ink-300/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link to="/" className="text-lg font-bold text-ink-900 shrink-0">
          {storeConfig.storeName}
        </Link>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <Link to={user?'/profile':'/login'}
           className="hidden sm:flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900">
            <User size={20} />
          </Link>
          <Link to="/cart" className="relative flex items-center">
            <ShoppingCart size={22} className="text-ink-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

export default Navbar;