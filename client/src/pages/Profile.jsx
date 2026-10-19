import { useState } from "react";
import { User, Mail, Phone, LogOut,Package ,Heart, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";

function Profile() {
  const { user, logout } = useAuthContext();
  const { show } = useToast();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      show("Logged out successfully");
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  if (!user) return null; // ProtectedRoute already handles the redirect

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-xl font-bold text-ink-900 mb-6">My Profile</h1>

      <div className="rounded-card border border-ink-300/50 bg-white p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center">
            <User size={24} className="text-brand-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-ink-900">{user.name}</p>
            <p className="text-xs text-ink-500 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3 text-ink-700">
            <Mail size={16} className="text-ink-500" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-ink-700">
              <Phone size={16} className="text-ink-500" />
              {user.phone}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-card border border-ink-300/50 bg-white mb-6 overflow-hidden">
        <Link
          to="/orders"
          className="flex items-center justify-between px-5 py-4 border-b border-ink-300/30 hover:bg-surface-bg"
        >
          <span className="flex items-center gap-3 text-sm text-ink-700">
            <Package size={16} className="text-ink-500" /> My Orders
          </span>
          <ChevronRight size={16} className="text-ink-500" />
        </Link>
        <Link
          to="/wishlist"
          className="flex items-center justify-between px-5 py-4 hover:bg-surface-bg"
        >
          <span className="flex items-center gap-3 text-sm text-ink-700">
            <Heart size={16} className="text-ink-500" /> My Wishlist
          </span>
          <ChevronRight size={16} className="text-ink-500" />
        </Link>
      </div>

      <Button
        variant="secondary"
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full"
      >
        <LogOut size={16} /> {loggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}

export default Profile;
