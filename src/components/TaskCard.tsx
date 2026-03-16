import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar } from 'lucide-react';
import { format, isPast, isToday, differenceInHours, parseISO } from 'date-fns';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityConfig = {
  high: { label: 'High', color: '#ef4444' },
  normal: { label: 'Normal', color: '#3b82f6' },
  low: { label: 'Low', color: '#94a3b8' },
};

function getDueDateStyle(dueDate: string): { color: string; bg: string } {
  const date = parseISO(dueDate);
  if (isPast(date) && !isToday(date)) return { color: '#ef4444', bg: '#fef2f2' };
  if (isToday(date) || differenceInHours(date, new Date()) <= 24) return { color: '#d97706', bg: '#fffbeb' };
  return { color: '#64748b', bg: '#f8fafc' };
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: '#fff',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    padding: '10px 12px',
    cursor: 'grab',
    opacity: isDragging ? 0.4 : 1,
    boxShadow: isDragging ? '0 10px 25px -5px rgba(0,0,0,0.1)' : 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
  };

  const handleClick = () => {
    // Only open modal if it wasn't a drag
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div style={{ pointerEvents: 'none' }}>
        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
            {task.labels.map(label => (
              <span
                key={label.id}
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: label.color + '18',
                  color: label.color,
                  letterSpacing: '0.02em',
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.3, margin: 0 }}>
          {task.title}
        </p>

        {/* Description */}
        {task.description && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          {/* Priority */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: priorityConfig[task.priority].color }} />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{priorityConfig[task.priority].label}</span>
          </div>

          {/* Due date */}
          {task.due_date && (() => {
            const ds = getDueDateStyle(task.due_date);
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, fontSize: 12, fontWeight: 500, color: ds.color, backgroundColor: ds.bg }}>
                <Calendar style={{ width: 12, height: 12 }} />
                {format(parseISO(task.due_date), 'MMM d')}
              </span>
            );
          })()}
        </div>

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            {task.assignees.slice(0, 3).map((member, i) => (
              <div
                key={member.id}
                title={member.name}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: member.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  border: '2px solid #fff',
                  marginLeft: i > 0 ? -6 : 0,
                }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>+{task.assignees.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
