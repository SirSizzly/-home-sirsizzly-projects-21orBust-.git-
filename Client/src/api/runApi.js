// Client/src/api/runApi.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/run";

export const startRun = async () => {
  const res = await axios.post(`${API_BASE}/start`);
  return res.data;
};

export const getRun = async (runId) => {
  const res = await axios.get(`${API_BASE}/${runId}`);
  return res.data;
};

export const hit = async (runId) => {
  const res = await axios.post(`${API_BASE}/${runId}/hit`);
  return res.data;
};

export const stay = async (runId) => {
  const res = await axios.post(`${API_BASE}/${runId}/stay`);
  return res.data;
};

export const splitHand = async (runId) => {
  const res = await axios.post(`${API_BASE}/${runId}/split`);
  return res.data;
};

export const doubleDown = async (runId) => {
  const res = await axios.post(`${API_BASE}/${runId}/double-down`);
  return res.data;
};
