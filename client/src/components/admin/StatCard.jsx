function StatCard({ icon: Icon, label, value, accent = 'text-brand-600' }) {
  return (
    <div className="rounded-card border border-ink-300/50 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ink-500">{label}</span>
        <Icon size={18} className={accent} />
      </div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
    </div>
  );
}

export default StatCard;