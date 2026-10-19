import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-bg">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;