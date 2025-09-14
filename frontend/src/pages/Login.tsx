import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        return
      }
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('userEmail', data.user.email)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', background: '#0f1533', border: '1px solid #1e2650', padding: 24, borderRadius: 12 }}>
      <h1 style={{ marginBottom: 12 }}>Login</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required style={inputStyle} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required style={inputStyle} />
        {error && <div style={{ color: '#ff9ea0' }}>{error}</div>}
        <button style={btnStyle}>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}

const inputStyle: React.CSSProperties = { background: '#0b1020', border: '1px solid #2a335f', padding: '10px 12px', borderRadius: 8, color: 'white' }
const btnStyle: React.CSSProperties = { background: '#2d62ff', border: 0, padding: '10px 12px', borderRadius: 8, color: 'white', cursor: 'pointer' }
