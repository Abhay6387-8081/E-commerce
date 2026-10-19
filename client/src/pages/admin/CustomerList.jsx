import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DataTable from '../../components/admin/DataTable';
import Skeleton from '../../components/ui/Skeleton';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/admin/customers')
      .then((res) => setCustomers(res.data.customers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-64 rounded-card" />;

  return (
    <div>
      <h1 className="text-xl font-bold text-ink-900 mb-6">Customers</h1>
      <DataTable columns={['Name', 'Email', 'Phone', 'Joined']}>
        {customers.map((c) => (
          <tr key={c._id} className="border-b border-ink-300/20 last:border-0">
            <td className="px-4 py-3">{c.name}</td>
            <td className="px-4 py-3 text-ink-500">{c.email}</td>
            <td className="px-4 py-3 text-ink-500">{c.phone || '—'}</td>
            <td className="px-4 py-3 text-ink-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

export default CustomerList;