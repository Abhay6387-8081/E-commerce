function DataTable({ columns, children }) {
  return (
    <div className="rounded-card border border-ink-300/50 bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-300/40 text-left">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default DataTable;