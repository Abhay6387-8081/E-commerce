import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, IndianRupee, AlertTriangle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatCurrency';
import StatCard from '../../components/admin/StatCard';
import Skeleton from '../../components/ui/Skeleton';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchSummary() {
      try {
        const res = await axiosClient.get('/admin/dashboard');
        if (!ignore) setData(res.data);
      } catch {
        if (!ignore) setData(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchSummary();
    return () => { ignore = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-card" />)}
      </div>
    );
  }

  if (!data) return <p className="text-ink-500 text-sm">Could not load dashboard data.</p>;

  const { summary, recentOrders } = data;

  return (
    <div>
      <h1 className="text-xl font-bold text-ink-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={summary.totalOrders} />
        <StatCard icon={IndianRupee} label="Total Sales" value={formatCurrency(summary.totalSales)} accent="text-success" />
        <StatCard icon={Package} label="Total Products" value={summary.totalProducts} />
        <StatCard icon={Users} label="Total Customers" value={summary.totalCustomers} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={summary.lowStockCount} accent="text-warning" />
      </div>

      <h2 className="text-sm font-semibold text-ink-900 mb-3">Recent Orders</h2>
      <div className="rounded-card border border-ink-300/50 bg-white divide-y divide-ink-300/30">
        {recentOrders.length === 0 && <p className="p-4 text-sm text-ink-500">No orders yet.</p>}
        {recentOrders.map((order) => (
          <Link
            key={order._id}
            to={`/admin/orders/${order._id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-surface-bg"
          >
            <div>
              <p className="text-sm font-medium text-ink-900">{order.user?.name || 'Unknown'}</p>
              <p className="text-xs text-ink-500">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <span className="text-sm font-semibold text-ink-900">{formatCurrency(order.totalAmount)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;