import {Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon,FacebookIcon } from '../icons';
import storeConfig from '../../config/storeConfig';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-ink-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-10">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">{storeConfig.storeName}</h3>
          <p className="text-sm">{storeConfig.tagline}</p>
          <div className="flex gap-3 mt-4">
            {storeConfig.social.instagram && (
              <a href={storeConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon size={18} className="hover:text-white" />
              </a>
            )}
            {storeConfig.social.facebook && (
              <a href={storeConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon size={18} className="hover:text-white" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2"><Mail size={14} /> {storeConfig.email}</span>
            <span className="flex items-center gap-2"><Phone size={14} /> {storeConfig.phone}</span>
            <span className="flex items-center gap-2"><MapPin size={14} /> {storeConfig.address}</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span>Shop</span>
            <span>Cart</span>
            <span>Order History</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {year} {storeConfig.storeName}. This is a portfolio demo project — not a live operating store.
      </div>
    </footer>
  );
}

export default Footer;