import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';

function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts title="Featured Products" filterKey="isFeatured" /> 
      <FeaturedProducts title="Best Sellers" filterKey="isBestSeller" />
    </div>
  );
}

export default Home;