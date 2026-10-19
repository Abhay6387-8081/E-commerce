import { Link } from 'react-router-dom';
import { mockCategories } from '../../data/mockProducts';

function CategoryGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-lg font-semibold text-ink-900 mb-4">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {mockCategories.map((c) => (
          <Link
            key={c.id}
            to={`/products?category=${c.slug}`}
            className="flex flex-col items-center gap-2 p-3 rounded-card border border-ink-300/50 bg-white hover:shadow-card transition-shadow text-center"
          >
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-semibold text-xs">
              {c.name.charAt(0)}
            </div>
            <span className="text-xs text-ink-700 leading-tight">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
