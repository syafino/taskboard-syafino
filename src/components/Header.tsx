import { Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header style={{ height: 72, padding: '0 40px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>Task Board</h1>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Manage your tasks visually</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search"
            style={{ width: 220, height: 40, paddingLeft: 42, paddingRight: 16, borderRadius: 8, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: 13, color: '#475569', outline: 'none' }}
          />
        </div>
        <button style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Bell style={{ width: 18, height: 18 }} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>
          G
        </div>
      </div>
    </header>
  );
}
