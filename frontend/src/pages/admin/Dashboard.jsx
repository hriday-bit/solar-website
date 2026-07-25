import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const STATUSES = ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'];
const STATUS_COLORS = {
  New: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Contacted: { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  Quoted: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  Converted: { bg: '#ECFDF5', color: '#065F46', border: '#6EE7B7' },
  Lost: { bg: '#FEF2F2', color: '#B91C1C', border: '#FCA5A5' },
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AdminDashboard() {
  const { authFetch } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/analytics')
      .then(r => r.json())
      .then(data => { setAnalytics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6B7280', fontSize: '1.1rem' }}>
      ⏳ Loading analytics...
    </div>
  );

  const topProduct = analytics?.top_products_by_likes?.[0];

  const overviewCards = [
    { label: 'Leads This Week', value: analytics?.total_leads_week ?? 0, icon: '📅', color: '#3B82F6' },
    { label: 'Leads This Month', value: analytics?.total_leads_month ?? 0, icon: '📆', color: '#F59E0B' },
    { label: 'Total Leads', value: analytics?.total_leads_all ?? 0, icon: '📋', color: '#8B5CF6' },
    { label: 'Products In Stock', value: analytics?.total_products_in_stock ?? 0, icon: '📦', color: '#10B981' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#14213D', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Overview of your solar business performance.</p>
      </div>

      {/* Overview Cards */}
      <div className="admin-stats-grid">
        {overviewCards.map(card => (
          <div key={card.label} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  {card.label}
                </p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '2.2rem', color: '#14213D', lineHeight: 1 }}>
                  {card.value}
                </p>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-secondary-grid">
        {/* Lead Status Pipeline */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#14213D', marginBottom: '1.25rem' }}>
            📊 Lead Pipeline
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {STATUSES.map(status => {
              const found = analytics?.lead_status_counts?.find(s => s.status === status);
              const count = found?.count || 0;
              const total = analytics?.total_leads_all || 1;
              const pct = Math.round((count / total) * 100);
              const style = STATUS_COLORS[status];
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontFamily: 'Poppins', fontWeight: 600, color: style.color }}>{status}</span>
                    <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: style.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Liked Products */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#14213D', marginBottom: '1.25rem' }}>
            ❤️ Most Liked Products
          </h3>
          {analytics?.top_products_by_likes?.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>No likes yet. Visitors will start clicking "Interested" on products.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics?.top_products_by_likes?.slice(0, 6).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', color: i === 0 ? '#FF8A00' : '#9CA3AF', width: '20px' }}>
                    #{i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#14213D' }}>{p.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{p.category}</p>
                  </div>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: '#FF8A00' }}>
                    ❤️ {p.like_count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'linear-gradient(135deg, #0B3D91, #14213D)', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 16px rgba(11,61,145,0.2)' }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { label: 'View All Leads', href: '/admin/leads', icon: '📋' },
              { label: 'Add New Product', href: '/admin/products', icon: '➕' },
              { label: 'Export Leads CSV', href: `${API_BASE}/api/admin/leads/export`, icon: '📥', external: true },
              { label: 'View Public Website', href: '/', icon: '🌐', external: true },
            ].map(action => (
              <a key={action.label} href={action.href} target={action.external ? '_blank' : '_self'} rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  padding: '0.65rem 1rem', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.88rem',
                  textDecoration: 'none', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,138,0,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <span>{action.icon}</span> {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
