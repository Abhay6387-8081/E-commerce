import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, LogOut } from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const LINKS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
];

function AdminSidebar() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className="w-56 shrink-0 bg-surface-dark min-h-screen flex flex-col p-4">
      <h2 className="text-white font-bold text-lg mb-8 px-2">Admin Panel</h2>

      <nav className="flex flex-col gap-1">
        {LINKS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-brand-500 text-white' : 'text-ink-300 hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-300 hover:bg-white/5"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;