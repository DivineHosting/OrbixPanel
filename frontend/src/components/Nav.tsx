import { Link, useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  }
  return (
    <nav style={{ background: '#111735', borderBottom: '1px solid #242b50' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/dashboard" style={{ color: '#9fc5ff', textDecoration: 'none', fontWeight: 700 }}>Orbix Panel</Link>
        <div style={{ display: 'flex', gap: 12 }}>
          {!token && <Link to="/" style={{ color: '#cfe2ff', textDecoration: 'none' }}>Login</Link>}
          {!token && <Link to="/register" style={{ color: '#cfe2ff', textDecoration: 'none' }}>Register</Link>}
          {token && <button onClick={logout} style={{ background: '#2d62ff', color: 'white', border: 0, padding: '8px 12px', borderRadius: 8 }}>Logout</button>}
        </div>
      </div>
    </nav>
  )
}
