import { useState } from 'react';
import { Table, ArrowUpDown, Search } from 'lucide-react';

export default function TraceabilityMatrix({ changes, onRowClick }) {
  const [sortConfig, setSortConfig] = useState({ key: 'req_id', direction: 'ascending' });
  const [filter, setFilter] = useState('');

  const sortedChanges = [...changes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredChanges = sortedChanges.filter((change) => {
    const term = filter.toLowerCase();
    const reqText = (change.new || change.old || "").toLowerCase();
    const idText = (change.req_id || "").toLowerCase();
    const reasonText = (change.detected_changes?.reason || "").toLowerCase();
    return reqText.includes(term) || idText.includes(term) || reasonText.includes(term);
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unchanged': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Modified': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Added': return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'Removed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="glass-card p-6 border-t-4 border-slate-700 break-inside-avoid mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-800">Traceability Matrix</h3>
        </div>
        <div className="relative w-full sm:w-64 print:hidden">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search matrix..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 shadow-sm custom-scrollbar bg-white">
        <table className="w-full text-left border-collapse text-sm relative">
          <thead className="sticky top-0 z-10 shadow-sm">
            <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider">
              <th className="p-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('req_id')}>
                <div className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3 font-semibold">Requirement</th>
              <th className="p-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('module')}>
                <div className="flex items-center gap-1">Module <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('status')}>
                <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3 font-semibold">Change Reason</th>
              <th className="p-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => requestSort('similarity')}>
                <div className="flex items-center gap-1">Similarity <ArrowUpDown className="w-3 h-3" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChanges.map((change, i) => (
              <tr 
                key={i} 
                onClick={() => onRowClick && onRowClick(change.req_id)}
                className={`cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-slate-100 transition-all duration-200`}
              >
                <td className="p-3 font-mono text-xs font-bold text-slate-700 whitespace-nowrap align-middle">{change.req_id}</td>
                <td className="p-3 text-slate-800 align-middle">
                  <div className="max-w-[200px] sm:max-w-xs md:max-w-sm truncate font-medium" title={change.new || change.old}>
                    {change.new || change.old}
                  </div>
                </td>
                <td className="p-3 align-middle">
                  <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 whitespace-nowrap shadow-sm">
                    {change.module || 'Other'}
                  </span>
                </td>
                <td className="p-3 align-middle">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm whitespace-nowrap ${getStatusColor(change.status)}`}>
                    {change.status}
                  </span>
                </td>
                <td className="p-3 text-slate-600 text-xs align-middle">
                  <div className="truncate max-w-[120px] sm:max-w-[150px] font-medium" title={change.detected_changes?.reason || 'No change detected'}>
                    {change.detected_changes?.reason || '—'}
                  </div>
                </td>
                <td className="p-3 font-extrabold text-slate-700 align-middle">
                  {change.similarity ? `${(change.similarity * 100).toFixed(0)}%` : '—'}
                </td>
              </tr>
            ))}
            {filteredChanges.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">No matching records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
