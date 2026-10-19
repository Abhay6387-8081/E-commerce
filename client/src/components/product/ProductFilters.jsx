import { mockCategories } from '../../data/mockProducts';

function ProductFilters({ selectedCategory, onCategoryChange, maxPrice, onMaxPriceChange }) {
  return (
    <aside className="w-full sm:w-56 shrink-0">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`text-left text-sm px-3 py-1.5 rounded-lg ${
              selectedCategory === '' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-700 hover:bg-surface-bg'
            }`}
          >
            All Categories
          </button>
          {mockCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.slug)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg ${
                selectedCategory === c.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-700 hover:bg-surface-bg'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Max Price: ₹{maxPrice}</h3>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-brand-500"
        />
      </div>
    </aside>
  );
}

export default ProductFilters;
