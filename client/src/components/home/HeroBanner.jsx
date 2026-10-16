import { Link } from 'react-router-dom';
import storeConfig from '../../config/storeConfig';

function HeroBanner() {
  return (
    <section className="bg-brand-50">
      <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col items-start">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 max-w-md mb-3">
          {storeConfig.tagline}
        </h1>
        <p className="text-sm text-ink-700 mb-6 max-w-sm">
          Shop everyday groceries and essentials from {storeConfig.storeName}.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 rounded-full bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

export default HeroBanner;