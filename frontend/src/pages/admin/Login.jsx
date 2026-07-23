import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0B3D91 0%, #14213D 50%, #7A3500 100%)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: '#fff',
        borderRadius: '24px', padding: '2.5rem 2rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', background: 'linear-gradient(135deg, #FF8A00, #F5A623)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(255,138,0,0.4)',
          }}>☀️</div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.4rem', color: '#14213D', marginBottom: '0.25rem' }}>
            Admin Login
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>Rishabh Enterprises UTL Solar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="admin-username" style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1F2937', marginBottom: '0.4rem' }}>
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
              className="contact-input"
            />
          </div>
          <div style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="admin-password" style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1F2937', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="contact-input"
            />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#B91C1C', fontSize: '0.88rem', display: 'flex', gap: '0.5rem' }}>
              ❌ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Logging in...' : '🔐 Login to Admin Panel'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#6B7280', fontSize: '0.82rem', textDecoration: 'none' }}>
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
