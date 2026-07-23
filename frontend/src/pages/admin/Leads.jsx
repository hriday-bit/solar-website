import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const STATUSES = ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'];
const STATUS_COLORS = {
  New: { bg: '#EFF6FF', color: '#1D4ED8' },
  Contacted: { bg: '#FFF7ED', color: '#C2410C' },
  Quoted: { bg: '#FFFBEB', color: '#B45309' },
  Converted: { bg: '#ECFDF5', color: '#065F46' },
  Lost: { bg: '#FEF2F2', color: '#B91C1C' },
};

export default function AdminLeads() {
  const { authFetch, token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    authFetch('/api/admin/leads')
      .then(r => r.json())
      .then(data => { setLeads(data.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await authFetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch { }
    setUpdatingId(null);
  };

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  );

  const formatDate = dt => {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#14213D', marginBottom: '0.25rem' }}>Leads</h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>{leads.length} total enquiries received</p>
        </div>
        <a
          href={`${API_BASE}/api/admin/leads/export`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff',
            fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem',
            padding: '0.65rem 1.25rem', borderRadius: '10px', textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
          }}
          download
        >
          📥 Export CSV
        </a>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍  Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="contact-input"
          style={{ maxWidth: '380px' }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>⏳ Loading leads...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['#', 'Name', 'Phone', 'Message', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#9CA3AF' }}>
                      {search ? 'No leads match your search.' : 'No leads yet.'}
                    </td>
                  </tr>
                )}
                {filtered.map((lead, i) => {
                  const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.New;
                  const waMsg = encodeURIComponent(`Hi ${lead.name}, this is Rishabh Enterprises UTL Solar. We received your enquiry: "${lead.message.slice(0, 80)}..."`);
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#9CA3AF', fontFamily: 'Poppins', fontWeight: 600 }}>
                        #{lead.id}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', color: '#14213D', whiteSpace: 'nowrap' }}>
                        {lead.name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <a href={`tel:${lead.phone}`} title="Call" style={{ fontSize: '0.85rem', color: '#0B3D91', fontWeight: 600, textDecoration: 'none' }}>
                            📞 {lead.phone}
                          </a>
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                            style={{ fontSize: '1rem', textDecoration: 'none' }}>
                            💬
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#4B5563', maxWidth: '260px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.message}>
                          {lead.message}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                        {formatDate(lead.created_at)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.6rem', borderRadius: '8px', border: `1px solid ${sc.bg}`,
                            background: sc.bg, color: sc.color, fontFamily: 'Poppins', fontWeight: 600,
                            fontSize: '0.8rem', cursor: 'pointer', outline: 'none',
                          }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
