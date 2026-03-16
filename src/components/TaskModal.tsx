import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority, TeamMember, Label } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string | null;
    assignee_ids?: string[];
    label_ids?: string[];
  }) => void;
  onDelete?: () => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  teamMembers: TeamMember[];
  labels: Label[];
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  fontSize: 14,
  color: '#334155',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  task,
  defaultStatus = 'todo',
  teamMembers,
  labels,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [dueDate, setDueDate] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.due_date || '');
      setSelectedAssignees(task.assignees?.map(a => a.id) || []);
      setSelectedLabels(task.labels?.map(l => l.id) || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('normal');
      setDueDate('');
      setSelectedAssignees([]);
      setSelectedLabels([]);
    }
  }, [task, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      due_date: dueDate || null,
      assignee_ids: selectedAssignees,
      label_ids: selectedLabels,
    });
    onClose();
  };

  const toggleAssignee = (id: string) => {
    setSelectedAssignees(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleLabel = (id: string) => {
    setSelectedLabels(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #e2e8f0',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: 0 }}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {/* Title */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              style={inputStyle}
              autoFocus
              required
              onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13, 148, 136, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13, 148, 136, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
                style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 40, cursor: 'pointer' }}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}
                style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 40, cursor: 'pointer' }}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
          </div>

          {/* Assignees */}
          {teamMembers.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Assignees</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {teamMembers.map(member => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAssignee(member.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      border: selectedAssignees.includes(member.id) ? '2px solid #0d9488' : '1px solid #e2e8f0',
                      backgroundColor: selectedAssignees.includes(member.id) ? '#f0fdfa' : '#f8fafc',
                      color: selectedAssignees.includes(member.id) ? '#0d9488' : '#64748b',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    {member.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Labels</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {labels.map(label => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      border: selectedLabels.includes(label.id) ? `2px solid ${label.color}` : '1px solid #e2e8f0',
                      backgroundColor: label.color + '12',
                      color: label.color,
                      cursor: 'pointer',
                      opacity: selectedLabels.includes(label.id) ? 1 : 0.6,
                    }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <div>
              {task && onDelete && (
                <button
                  type="button"
                  onClick={() => { onDelete(); onClose(); }}
                  style={{ fontSize: 13, color: '#ef4444', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Delete task
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: '#0d9488', border: 'none', cursor: 'pointer' }}
              >
                {task ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
