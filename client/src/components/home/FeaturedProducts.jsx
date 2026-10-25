import {useEffect,useState} from 'react';
import axiosClient from '../../api/axiosClient'
import ProductCard from '../product/ProductCard';

function FeaturedProducts({ title,filterKey}) {
  const [items,setItems] = useState([]);

 useEffect(()=>{
  axiosClient.get('/products',{params:{[filterKey]:true,limit:4}}).then((res)=>setItems(res.data.products.map((p)=>({...p,id:p._id,category:p.category?.slug||p.category})))).catch(()=>setItems([]));
 },[filterKey])

  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-lg font-semibold text-ink-900 mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
