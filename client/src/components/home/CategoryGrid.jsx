
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const INITIAL_LIMIT = 8;

function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axiosClient.get('/categories').then((res) => {
      setCategories(res.data.categories);
  })
  }, []);

  const visibleCategories = showAll ? categories : categories.slice(0, INITIAL_LIMIT);
  const hasMore = categories.length > INITIAL_LIMIT;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-lg font-semibold text-ink-900 mb-4">Shop by Category</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {visibleCategories.map((c) => (
          <Link
            key={c._id}
            to={`/products?category=${encodeURIComponent(c.slug)}`}
            className="flex flex-col items-center gap-2 p-3 rounded-card border border-ink-300/50 bg-white hover:shadow-card transition-shadow text-center"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-50">
              <img
                src={c.imageUrl}
                alt={c.name}
                onError={(e) => { e.currentTarget.src = '/images/products/placeholder.jpg'; }}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-ink-700 leading-tight">{c.name}</span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-5">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            {showAll ? 'View Less' : `View More (${categories.length - INITIAL_LIMIT} more)`}
          </button>
        </div>
      )}
    </section>
  );
}

export default CategoryGrid;
