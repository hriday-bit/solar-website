import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/leads', label: 'Leads', icon: '📋' },
  { to: '/admin/products', label: 'Products', icon: '🛒' },
];

export default function Sidebar() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside style={{
      width: '240px', minHeight: '100vh', flexShrink: 0,
      background: 'linear-gradient(180deg, #0B3D91 0%, #14213D 100%)',
      display: 'flex', flexDirection: 'column', padding: '0',
      position: 'sticky', top: 0, height: '100vh',
      boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
    }}>
      {/* Brand */}
      <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #FF8A00, #F5A623)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
            ☀️
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '0.85rem', color: '#fff', lineHeight: 1.2 }}>RISHABH SOLAR</p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '10px',
              fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.9rem',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(255,138,0,0.25)' : 'transparent',
              borderLeft: isActive ? '3px solid #FF8A00' : '3px solid transparent',
              textDecoration: 'none', transition: 'all 0.2s',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF8A00, #F5A623)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
            {username ? username.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{username || 'Admin'}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '0.65rem 1rem', borderRadius: '10px',
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#FCA5A5', fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.85rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
