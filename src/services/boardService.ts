// src/services/boardService.ts
import axios from "axios";

export interface BoardType {
  id?: number;
  name: string;
  active?: number;
}

// Root of your Express router mount point, e.g. app.use('/api/boardinfo', router)
const API_ROOT = (import.meta as any)?.env?.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://192.168.236.100:3000/api/boardinfo"; // fallback

// Normalize possible Buffer-like active field coming from backend
const normalizeActive = (activeField: any): number => {
  if (activeField && typeof activeField === "object" && Array.isArray((activeField as any).data)) {
    return Number((activeField as any).data[0]) || 0;
  }
  return Number(activeField) || 0;
};

// GET: /allboards
export const getBoards = async (): Promise<BoardType[]> => {
  const res = await axios.get(`${API_ROOT}/allboards`);
  return (res.data || []).map((board: any) => ({
    ...board,
    active: normalizeActive(board.active),
  }));
};

// POST: /boardtype
export const addBoard = async (payload: { name: string; active?: number }): Promise<BoardType> => {
  const res = await axios.post(`${API_ROOT}/boardtype`, payload);
  const data = res.data || {};
  return { ...data, active: normalizeActive(data.active) } as BoardType;
};

// PUT: /boardtype/:id
export const updateBoard = async (
  id: number,
  payload: { name?: string; active?: number }
): Promise<BoardType> => {
  const res = await axios.put(`${API_ROOT}/boardtype/${id}`, payload);
  const data = res.data?.response || res.data || {};
  return { ...data, active: normalizeActive(data.active) } as BoardType;
};

// DELETE: /boardtype/:id
export const deleteBoard = async (id: number): Promise<void> => {
  await axios.delete(`${API_ROOT}/boardtype/${id}`);
};
