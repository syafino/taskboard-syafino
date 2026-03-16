import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { TeamMember } from '../types';

interface TeamManagerProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onAdd: (name: string, color: string) => void;
  onRemove: (id: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#6366f1',
];

export function TeamManager({ isOpen, onClose, members, onAdd, onRemove }: TeamManagerProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName('');
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', width: '100%', maxWidth: 480, border: '1px solid #e2e8f0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: 0 }}>Team Members</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ padding: 28 }}>
          {/* Name input + add button */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Member name"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: 14, color: '#334155', outline: 'none' }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleAdd}
              style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#0d9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            >
              <Plus style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 10 }}>Color</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '3px solid #0d9488' : '3px solid transparent',
                    outline: color === c ? '2px solid #99f6e4' : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Member list */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12 }}>Members</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {members.length === 0 ? (
                <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>No team members yet</p>
              ) : (
                members.map(member => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>{member.name}</span>
                    </div>
                    <button
                      onClick={() => onRemove(member.id)}
                      style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#cbd5e1' }}
                    >
                      <Trash2 style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
