/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE = "http://192.168.236.199:3000/api/academicyearinfo/academicyear";
const DEFAULT_SCHOOL_ID = 23;

// 🔹 Convert backend data to ensure `active` is always 0 or 1
const normalizeActive = (activeField: any) => {
  if (typeof activeField === "object" && activeField?.data) {
    return activeField.data[0]; // Extract 0 or 1 from Buffer
  }
  return Number(activeField) || 0;
};

// ✅ Get all academic years for school 23
export const getAcademics = async () => {
  const res = await axios.get(`${API_BASE}/${DEFAULT_SCHOOL_ID}`);
  return res.data.map((item: any) => ({
    ...item,
    active: normalizeActive(item.active),
  }));
};

// ✅ Add new academic year
export const addAcademic = async (payload: {
  academic_year: string;
  active?: number;
}) => {
  const res = await axios.post(API_BASE, {
    ...payload,
    school_id: DEFAULT_SCHOOL_ID,
  });
  return {
    ...res.data,
    active: normalizeActive(res.data.active),
  };
};

// ✅ Update existing academic year
export const updateAcademic = async (id: number, payload: { academic_year?: string; }) => {
  // FIX: Pass the 'id' in the request body, not the URL.
  const res = await axios.put(API_BASE, {
    id: id, // Explicitly add the ID to the payload
    ...payload,
    school_id: DEFAULT_SCHOOL_ID,
  });
  return {
    ...res.data,
  };
};

// ✅ Delete academic year
export const deleteAcademic = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};
