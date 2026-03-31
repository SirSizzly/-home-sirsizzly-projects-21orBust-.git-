const BASE = "http://localhost:3000/api";

export async function getShop(runId) {
  const res = await fetch(`${BASE}/shop/${runId}`);
  return res.json();
}

export async function buyItem(runId, type, slot) {
  const res = await fetch(`${BASE}/shop/${runId}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, slot }),
  });
  return res.json();
}
