import fs from 'fs';
import path from 'path';

type User = { id: string; email: string; passwordHash: string; createdAt: string };
type ServerRec = { id: string; userId: string; name: string; game: string; ramMb: number; cpuPct: number; status: 'stopped'|'starting'|'running'|'stopping'|'restarting' };
type NodeRec = { id: string; name: string; lastHeartbeat: string };

type DB = {
  users: User[];
  servers: ServerRec[];
  nodes: NodeRec[];
};

const dataPath = path.resolve(process.cwd(), 'data', 'db.json');

function readDB(): DB {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify({ users: [], servers: [], nodes: [] }, null, 2));
  }
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(db: DB) {
  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export const db = {
  createUser(email: string, passwordHash: string) {
    const now = new Date().toISOString();
    const snapshot = readDB();
    if (snapshot.users.find(u => u.email.toLowerCase() == email.toLowerCase())) {
      throw new Error('EMAIL_IN_USE');
    }
    const user = { id: uid(), email, passwordHash, createdAt: now };
    snapshot.users.push(user);
    writeDB(snapshot);
    return user;
  },
  findUserByEmail(email: string) {
    const snapshot = readDB();
    return snapshot.users.find(u => u.email.toLowerCase() == email.toLowerCase()) || null;
  },
  getServersByUser(userId: string) {
    const snapshot = readDB();
    return snapshot.servers.filter(s => s.userId === userId);
  },
  createServer(userId: string, name: string, game: string, ramMb: number, cpuPct: number) {
    const snapshot = readDB();
    const server: ServerRec = { id: uid(), userId, name, game, ramMb, cpuPct, status: 'stopped' };
    snapshot.servers.push(server);
    writeDB(snapshot);
    return server;
  },
  updateServerStatus(userId: string, serverId: string, status: ServerRec['status']) {
    const snapshot = readDB();
    const s = snapshot.servers.find(sv => sv.id === serverId && sv.userId === userId);
    if (!s) return null;
    s.status = status;
    writeDB(snapshot);
    return s;
  }
};
