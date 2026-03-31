const BASE = "http://localhost:3000/api";

export async function startRun() {
  const res = await fetch(`${BASE}/run/start`, { method: "POST" });
  return res.json();
}

export async function getRun(id) {
  const res = await fetch(`${BASE}/run/${id}`);
  return res.json();
}

export async function hit(id) {
  const res = await fetch(`${BASE}/run/${id}/action/hit`, { method: "POST" });
  return res.json();
}

export async function stay(id) {
  const res = await fetch(`${BASE}/run/${id}/action/stay`, { method: "POST" });
  return res.json();
}

export async function nextHand(id) {
  const res = await fetch(`${BASE}/run/${id}/action/next-hand`, {
    method: "POST",
  });
  return res.json();
}

export async function nextBlind(id) {
  const res = await fetch(`${BASE}/run/${id}/action/next-blind`, {
    method: "POST",
  });
  return res.json();
}

export async function getDeck(id) {
  const res = await fetch(`${BASE}/run/${id}/deck`);
  return res.json();
}
