import 'dotenv/config';
import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const AGENT_KEY = process.env.AGENT_KEY || 'dev-agent-1';

async function heartbeat() {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (res.ok) {
      console.log(`[agent] heartbeat ok to ${API_URL} (${AGENT_KEY})`);
    } else {
      console.log(`[agent] heartbeat failed status ${res.status}`);
    }
  } catch (e) {
    console.log('[agent] heartbeat error', (e as Error).message);
  }
}

console.log('[agent] starting...');
setInterval(heartbeat, 5000);
