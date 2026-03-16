import { CheckCircle2, Clock, AlertTriangle, LayoutList } from 'lucide-react';
import type { Task } from '../types';
import { isPast, parseISO } from 'date-fns';

interface BoardStatsProps {
  tasks: Task[];
}

export function BoardStats({ tasks }: BoardStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const overdue = tasks.filter(t =>
    t.due_date && t.status !== 'done' && isPast(parseISO(t.due_date))
  ).length;

  const stats = [
    { label: 'Total', value: total, icon: LayoutList, iconColor: '#3b82f6', borderColor: '#3b82f6' },
    { label: 'In Progress', value: inProgress, icon: Clock, iconColor: '#f59e0b', borderColor: '#f59e0b' },
    { label: 'Completed', value: completed, icon: CheckCircle2, iconColor: '#10b981', borderColor: '#10b981' },
    { label: 'Overdue', value: overdue, icon: AlertTriangle, iconColor: '#ef4444', borderColor: '#ef4444' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      {stats.map(stat => (
        <div
          key={stat.label}
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            borderLeft: `3px solid ${stat.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <stat.icon style={{ width: 22, height: 22, color: stat.iconColor, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1, margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
