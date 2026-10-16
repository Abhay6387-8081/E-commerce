function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && <Icon size={40} className="text-ink-300 mb-4" strokeWidth={1.5} />}
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      {subtitle && <p className="text-sm text-ink-500 mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;