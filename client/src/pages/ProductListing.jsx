import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import ProductSort from "../components/product/ProductSort";
import { useDebounce } from "../hooks/useDebounce";

function ProductListing() {
  const [searchParams] = useSearchParams();
  const [category,setCategory] = useState(searchParams.get('category')||'')
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{
    setCategory(searchParams.get('category')||'');
  },[searchParams])

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const params = { sort, maxPrice };
        if (category) params.category = category;
        if (debouncedSearch) params.search = debouncedSearch;

        const res = await axiosClient.get("/products", { params });
        if (!ignore) setProducts(res.data.products);
      } catch {
        if (!ignore) setError("Could not load products.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      ignore = true;
    };
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
            <span className="text-sm text-ink-500">
              {products.length} products
            </span>
            <ProductSort value={sort} onChange={setSort} />
          </div>

          {error ? (
            <p className="text-sm text-danger py-8 text-center">{error}</p>
          ) : (
            <ProductGrid
              products={products.map(normalizeProduct)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function normalizeProduct(p) {
  return { ...p, id: p._id, category: p.category?.slug || p.category };
}

export default ProductListing;
