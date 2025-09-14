import { Outlet, useNavigate } from 'react-router-dom'
import Nav from './components/Nav'
import { useEffect } from 'react'

export default function App() {
  const navigate = useNavigate();
  useEffect(() => {
    // redirect to dashboard if already logged in
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, []);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#0b1020', color: '#e7eaf6' }}>
      <Nav />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
        <Outlet />
      </div>
    </div>
  )
}
