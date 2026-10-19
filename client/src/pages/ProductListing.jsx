import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import { useDebounce } from '../hooks/useDebounce';

function ProductListing() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [loading] = useState(false); // real loading state wired in Phase 8

  const filtered = useMemo(() => {
    let result = [...mockProducts];

    if (category) result = result.filter((p) => p.category === category);
    if (debouncedSearch) {
      result = result.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    result = result.filter((p) => p.price <= maxPrice);

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount);

    return result;
  }, [category, debouncedSearch, maxPrice, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-ink-900 mb-5">Shop Products</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full sm:w-80 mb-6 px-4 py-2.5 rounded-full border border-ink-300/60 text-sm focus:outline-none focus:border-brand-500"
      />

      <div className="flex flex-col sm:flex-row gap-6">
        <ProductFilters
          selectedCategory={category}
          onCategoryChange={setCategory}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-ink-500">{filtered.length} products</span>
            <ProductSort value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={filtered} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default ProductListing;
