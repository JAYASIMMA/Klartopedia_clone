// src/services/casteService.ts
import axios from "axios";

export interface CasteType {
  id: number;
  name: string;
  active: number;
}

const API_BASE = "http://192.168.236.167:3000/api/castecategoryinfo/allcaste"; 
// Replace with your actual caste API endpoint

// GET all castes
export const getCastes = async (): Promise<CasteType[]> => {
  const res = await axios.get(API_BASE);
  return res.data.map((caste: any) => ({
    id: caste.id,
    name: caste.name,
    active: normalizeActive(caste.active),
  }));
};

// POST new caste → default active = 1
export const addCaste = async (payload: { name: string; active?: number }): Promise<CasteType> => {
  const res = await axios.post(API_BASE, {
    name: payload.name,
    active: payload.active ?? 1, // ✅ Default to 1
  });
  return {
    id: res.data.id,
    name: res.data.name,
    active: normalizeActive(res.data.active),
  };
};

// PUT update caste → default active = 1
export const updateCaste = async (
  id: number,
  payload: { name?: string; active?: number }
): Promise<CasteType> => {
  const res = await axios.put(`${API_BASE}/${id}`, {
    ...payload,
    active: payload.active ?? 1, // ✅ Default to 1
  });
  return {
    id: res.data.id,
    name: res.data.name,
    active: normalizeActive(res.data.active),
  };
};

// DELETE caste
export const deleteCaste = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};

// Handle MySQL buffer for active field
function normalizeActive(activeField: any): number {
  if (typeof activeField === "object" && activeField?.data?.length > 0) {
    return Number(activeField.data[0]);
  }
  return Number(activeField) || 1; // ✅ Fallback default is 1
}
