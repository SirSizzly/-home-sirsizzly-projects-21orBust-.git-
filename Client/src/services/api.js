const BASE_URL = "/api";

export async function getRunState(runId) {
  const res = await fetch(`${BASE_URL}/runs/${runId}/state`);
  if (!res.ok) throw new Error("Failed to load run state");
  return res.json();
}

export async function postHandAction(runId, handIndex, action) {
  const res = await fetch(
    `${BASE_URL}/runs/${runId}/hands/${handIndex}/action`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    },
  );
  if (!res.ok) throw new Error("Failed to apply action");
  return res.json();
}

export async function getShopState(runId) {
  const res = await fetch(`${BASE_URL}/runs/${runId}/shop`);
  if (!res.ok) throw new Error("Failed to load shop");
  return res.json();
}
