import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Tags,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  onOpenTeamManager: () => void;
  onOpenLabelManager: () => void;
}

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 20px',
  borderRadius: 10,
  color: '#475569',
  fontSize: 15,
  fontWeight: 500,
  textDecoration: 'none',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  transition: 'background 0.15s, color 0.15s',
};

const activeNavStyle: React.CSSProperties = {
  ...navItemStyle,
  backgroundColor: '#f0fdfa',
  color: '#0d9488',
  fontWeight: 600,
};

export function Sidebar({ onOpenTeamManager, onOpenLabelManager }: SidebarProps) {
  return (
    <aside style={{
      width: 260,
      backgroundColor: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '28px 24px 28px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          backgroundColor: '#0d9488',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}>
          T
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>TaskBoard</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 3 }}>Project Manager</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <a href="#" style={navItemStyle}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LayoutDashboard style={{ width: 20, height: 20, flexShrink: 0 }} />
          <span>Dashboard</span>
        </a>
        <a href="#" style={activeNavStyle}>
          <KanbanSquare style={{ width: 20, height: 20, flexShrink: 0 }} />
          <span>Board</span>
        </a>
        <button onClick={onOpenTeamManager} style={navItemStyle}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Users style={{ width: 20, height: 20, flexShrink: 0 }} />
          <span>Team Members</span>
        </button>
        <button onClick={onOpenLabelManager} style={navItemStyle}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Tags style={{ width: 20, height: 20, flexShrink: 0 }} />
          <span>Labels</span>
        </button>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
        <a href="#" style={navItemStyle}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Settings style={{ width: 20, height: 20, flexShrink: 0, color: '#94a3b8' }} />
          <span style={{ color: '#94a3b8' }}>Settings</span>
        </a>
      </div>
    </aside>
  );
}
