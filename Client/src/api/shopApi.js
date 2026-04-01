// Client/src/api/shopApi.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export const getShop = async (runId) => {
  const res = await axios.get(`${API_BASE}/runs/${runId}/shop`);
  return res.data;
};

export const buyItem = async (runId, type, index = null) => {
  const res = await axios.post(`${API_BASE}/runs/${runId}/shop/buy`, {
    type,
    index,
  });
  return res.data;
};

export const rerollShop = async (runId) => {
  const res = await axios.post(`${API_BASE}/runs/${runId}/shop/reroll`);
  return res.data;
};
