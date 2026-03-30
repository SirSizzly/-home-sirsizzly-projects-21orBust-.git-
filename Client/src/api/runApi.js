// Create a new run
export async function createRun() {
  const res = await fetch("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to create run");
  }

  return res.json();
}

// Fetch authoritative run state
export async function fetchRunState(runId) {
  const res = await fetch(`/api/runs/${runId}/state`);

  if (!res.ok) {
    throw new Error("Failed to fetch run state");
  }

  return res.json();
}

// Apply a hand action (hit / stay / double / split)
export async function applyHandAction(runId, handIndex, action) {
  const res = await fetch(`/api/runs/${runId}/hands/${handIndex}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) {
    throw new Error("Action failed");
  }

  return res.json();
}
