import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

type Server = {
  id: string;
  name: string;
  game: string;
  ramMb: number;
  cpuPct: number;
  status: 'stopped'|'starting'|'running'|'stopping'|'restarting';
}

export default function Dashboard() {
  const [servers, setServers] = useState<Server[]>([])
  const [name, setName] = useState('My Server')
  const [game, setGame] = useState('minecraft')
  const [ramMb, setRamMb] = useState(1024)
  const [cpuPct, setCpuPct] = useState(100)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem('token');

  async function fetchServers() {
    const res = await fetch(`${API}/servers`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setServers(data)
    }
  }

  useEffect(() => { fetchServers() }, [])

  async function createServer(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch(`${API}/servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, game, ramMb, cpuPct })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to create'); return }
    setServers(s => [data, ...s])
  }

  async function action(id: string, op: 'start'|'stop'|'restart') {
    await fetch(`${API}/servers/${id}/${op}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    fetchServers()
  }

  return (
    <div>
      <h1 style={{ margin: '16px 0' }}>Dashboard</h1>
      <form onSubmit={createServer} style={{ display: 'grid', gap: 8, background: '#0f1533', border: '1px solid #1e2650', padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={inputStyle} />
          <select value={game} onChange={e => setGame(e.target.value)} style={inputStyle}>
            <option value="minecraft">Minecraft</option>
            <option value="csgo">CS:GO</option>
            <option value="valheim">Valheim</option>
          </select>
          <input type="number" value={ramMb} onChange={e => setRamMb(parseInt(e.target.value))} placeholder="RAM (MB)" style={inputStyle} />
          <input type="number" value={cpuPct} onChange={e => setCpuPct(parseInt(e.target.value))} placeholder="CPU (%)" style={inputStyle} />
        </div>
        {error && <div style={{ color: '#ff9ea0' }}>{error}</div>}
        <button style={btnStyle}>Create Server</button>
      </form>

      <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
        {servers.map(s => (
          <div key={s.id} style={{ background: '#0f1533', border: '1px solid #1e2650', padding: 16, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: 14, opacity: 0.8 }}>{s.game.toUpperCase()} • {s.ramMb}MB • CPU {s.cpuPct}%</div>
              <div style={{ marginTop: 4, fontSize: 13, color: '#9fc5ff' }}>Status: {s.status}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => action(s.id, 'start')} style={btnStyle}>Start</button>
              <button onClick={() => action(s.id, 'stop')} style={btnStyle}>Stop</button>
              <button onClick={() => action(s.id, 'restart')} style={btnStyle}>Restart</button>
            </div>
          </div>
        ))}
        {servers.length === 0 && <div style={{ opacity: 0.8 }}>No servers yet. Create one above.</div>}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { background: '#0b1020', border: '1px solid #2a335f', padding: '8px 10px', borderRadius: 8, color: 'white', minWidth: 120 }
const btnStyle: React.CSSProperties = { background: '#2d62ff', border: 0, padding: '8px 12px', borderRadius: 8, color: 'white', cursor: 'pointer' }
