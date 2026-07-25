import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Solar Panels', 'Solar Batteries', 'Solar Inverters', 'Charge Controllers', 'Complete Systems'];
const EMPTY_FORM = { name: '', category: CATEGORIES[0], description: '', price: '', image_url: '', icon_key: '', in_stock: true, is_featured: false };

export default function AdminProducts() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadProducts = () => {
    authFetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingProduct(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, description: p.description, price: p.price || '', image_url: p.image_url || '', icon_key: p.icon_key || '', in_stock: p.in_stock, is_featured: p.is_featured });
    setEditingProduct(p);
    setShowForm(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: form.price ? parseFloat(form.price) : null };
      if (editingProduct) {
        await authFetch(`/api/admin/products/${editingProduct.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await authFetch('/api/admin/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowForm(false);
      loadProducts();
    } catch { }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleteId(id);
    await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleField = async (p, field) => {
    await authFetch(`/api/admin/products/${p.id}`, { method: 'PATCH', body: JSON.stringify({ [field]: !p[field] }) });
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, [field]: !item[field] } : item));
  };

  const chartData = [...products].sort((a, b) => (b.like_count || 0) - (a.like_count || 0)).slice(0, 8).map(p => ({
    name: p.name.length > 16 ? p.name.slice(0, 14) + '…' : p.name,
    likes: p.like_count || 0,
  }));

  const Toggle = ({ value, onChange, label }) => (
    <button type="button" onClick={onChange}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      <div style={{
        width: '40px', height: '22px', borderRadius: '11px', position: 'relative',
        background: value ? '#FF8A00' : '#D1D5DB', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: '3px', left: value ? '19px' : '3px',
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.85rem', color: '#4B5563' }}>{label}</span>
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.8rem', color: '#14213D', marginBottom: '0.25rem' }}>Products</h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>{products.length} products in catalogue</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.9rem' }}>
          ➕ Add Product
        </button>
      </div>

      {/* Bar Chart */}
      {products.some(p => p.like_count > 0) && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#14213D', marginBottom: '1.25rem' }}>
            ❤️ Customer Interest (Likes per Product)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Inter' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: 'Poppins', borderRadius: '10px', border: '1px solid #E5E7EB' }} />
              <Bar dataKey="likes" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#FF8A00' : i === 1 ? '#F5A623' : '#0B3D91'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Product Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>⏳ Loading products...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Product', 'Category', 'Price', 'In Stock', 'Featured', 'Likes', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', color: '#14213D' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontFamily: 'Poppins', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '50px' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#4B5563', fontFamily: 'Poppins', fontWeight: 600 }}>
                      {p.price ? `₹${p.price.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Toggle value={p.in_stock} onChange={() => toggleField(p, 'in_stock')} label={p.in_stock ? 'Yes' : 'No'} />
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Toggle value={p.is_featured} onChange={() => toggleField(p, 'is_featured')} label={p.is_featured ? 'Yes' : 'No'} />
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'Poppins', fontWeight: 700, color: '#FF8A00', fontSize: '0.9rem' }}>
                      ❤️ {p.like_count || 0}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(p)}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', opacity: deleteId === p.id ? 0.6 : 1 }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.25rem', color: '#14213D', marginBottom: '1.5rem' }}>
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <form onSubmit={handleSave}>
              {[
                { label: 'Product Name *', name: 'name', type: 'text', required: true, placeholder: 'e.g. Mono PERC Solar Panel 400W' },
                { label: 'Price (₹, optional)', name: 'price', type: 'number', placeholder: 'e.g. 15000' },
                { label: 'Image URL (optional)', name: 'image_url', type: 'url', placeholder: 'https://...' },
                { label: 'Icon Key (optional)', name: 'icon_key', type: 'text', placeholder: 'e.g. solar_panel_mono' },
              ].map(field => (
                <div key={field.name} className="admin-form-group">
                  <label className="admin-form-label">{field.label}</label>
                  <input type={field.type} required={field.required} placeholder={field.placeholder}
                    value={form[field.name]} onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                    className="contact-input" style={{ fontSize: '0.9rem' }} />
                </div>
              ))}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', color: '#1F2937', marginBottom: '0.35rem' }}>Category *</label>
                <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="contact-input" style={{ fontSize: '0.9rem' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', color: '#1F2937', marginBottom: '0.35rem' }}>Description *</label>
                <textarea required rows={3} placeholder="Product description..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="contact-input" style={{ fontSize: '0.9rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1F2937' }}>In Stock</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1F2937' }}>Featured / Best Seller</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', color: '#6B7280' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? '⏳ Saving...' : editingProduct ? '💾 Save Changes' : '➕ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
