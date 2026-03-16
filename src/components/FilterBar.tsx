import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { TeamMember, Label, TaskPriority } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: TaskPriority | null;
  onPriorityChange: (priority: TaskPriority | null) => void;
  assigneeFilter: string | null;
  onAssigneeChange: (id: string | null) => void;
  labelFilter: string | null;
  onLabelChange: (id: string | null) => void;
  teamMembers: TeamMember[];
  labels: Label[];
}

const selectStyle: React.CSSProperties = {
  height: 40,
  padding: '0 36px 0 16px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  backgroundColor: '#fff',
  fontSize: 13,
  color: '#475569',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

export function FilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  assigneeFilter,
  onAssigneeChange,
  labelFilter,
  onLabelChange,
  teamMembers,
  labels,
}: FilterBarProps) {
  const hasFilters = priorityFilter || assigneeFilter || labelFilter || searchQuery;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8', pointerEvents: 'none' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          style={{ width: 260, height: 40, paddingLeft: 42, paddingRight: 16, borderRadius: 8, border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: 13, color: '#475569', outline: 'none' }}
        />
      </div>

      <div style={{ height: 24, width: 1, backgroundColor: '#e2e8f0', margin: '0 4px' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
        <SlidersHorizontal style={{ width: 16, height: 16, color: '#94a3b8' }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>Filters</span>
      </div>

      <select
        value={priorityFilter || ''}
        onChange={e => onPriorityChange((e.target.value as TaskPriority) || null)}
        style={selectStyle}
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="normal">Normal</option>
        <option value="low">Low</option>
      </select>

      {teamMembers.length > 0 && (
        <select
          value={assigneeFilter || ''}
          onChange={e => onAssigneeChange(e.target.value || null)}
          style={selectStyle}
        >
          <option value="">All assignees</option>
          {teamMembers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      )}

      {labels.length > 0 && (
        <select
          value={labelFilter || ''}
          onChange={e => onLabelChange(e.target.value || null)}
          style={selectStyle}
        >
          <option value="">All labels</option>
          {labels.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      )}

      {hasFilters && (
        <button
          onClick={() => {
            onSearchChange('');
            onPriorityChange(null);
            onAssigneeChange(null);
            onLabelChange(null);
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X style={{ width: 14, height: 14 }} />
          Clear
        </button>
      )}
    </div>
  );
}
