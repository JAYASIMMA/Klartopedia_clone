/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// IMPORTANT: Set your backend API base URL here.
// Based on your Express router setup (router.post('/', ...)), if this router
// is mounted under '/api/adminusers' in your main app, then this URL is correct.
const API_BASE_URL = "http://192.168.236.100:3000/api/adminuser"; // Example: Adjust if your base path is different

// --- Interfaces for Request Payloads and Response Structures ---

interface UserAdminPayload {
  name: string;
  username: string;
  password: string; // Password is optional for updates, but required for creation
  role: string;
  mobile_number: string;
  active_status?: number; // Optional for creation, but can be explicitly set
}

interface UserAdminUpdatePayload {
  id: number; // ID is required for updating
  name?: string;
  username?: string;
  password?: string;
  role?: string;
  mobile_number?: string;
  active_status?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any; // Consider defining a more specific type for data in a real app
}

// --- API Functions ---

/**
 * Registers a new Admin User (maps to backend POST /).
 * This is primarily used for the registration page.
 * @param payload The user data including name, username, password, role, and mobile_number.
 * @returns A promise resolving to an ApiResponse.
 */
export const registerUserAdmin = async (payload: UserAdminPayload): Promise<ApiResponse> => {
  try {
    const response = await axios.post(API_BASE_URL, payload);
    return { success: true, data: response.data, message: "User registered successfully." };
  } catch (error: any) {
    console.error('Error registering user:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to register user. Please try again.',
    };
  }
};

/**
 * Fetches all active Admin Users (maps to backend GET /).
 * @returns A promise resolving to an ApiResponse containing a list of active users.
 */
export const getAllActiveAdminUsers = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(API_BASE_URL);
    return { success: true, data: response.data, message: "Active users fetched successfully." };
  } catch (error: any) {
    console.error('Error fetching active users:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch active users.',
    };
  }
};

/**
 * Fetches an Admin User by their ID (maps to backend GET /:id).
 * @param id The ID of the user to fetch.
 * @returns A promise resolving to an ApiResponse containing the user data.
 */
export const getAdminUserById = async (id: number | string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return { success: true, data: response.data, message: "User fetched by ID successfully." };
  } catch (error: any) {
    console.error(`Error fetching user by ID ${id}:`, error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || `Failed to fetch user with ID ${id}.`,
    };
  }
};

/**
 * Fetches an Admin User by their username (maps to backend GET /username/:username).
 * @param username The username of the user to fetch.
 * @returns A promise resolving to an ApiResponse containing the user data.
 */
export const getAdminUserByUsername = async (username: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/username/${username}`);
    return { success: true, data: response.data, message: "User fetched by username successfully." };
  } catch (error: any) {
    console.error(`Error fetching user by username ${username}:`, error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || `Failed to fetch user with username ${username}.`,
    };
  }
};

/**
 * Fetches an Admin User by their mobile number (maps to backend GET /mobile/:mobile).
 * @param mobileNumber The mobile number of the user to fetch.
 * @returns A promise resolving to an ApiResponse containing the user data.
 */
export const getAdminUserByMobile = async (mobileNumber: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mobile/${mobileNumber}`);
    return { success: true, data: response.data, message: "User fetched by mobile number successfully." };
  } catch (error: any) {
    console.error(`Error fetching user by mobile number ${mobileNumber}:`, error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || `Failed to fetch user with mobile number ${mobileNumber}.`,
    };
  }
};

/**
 * Updates an existing Admin User (maps to backend PUT /).
 * @param payload The update data for the user, including their ID.
 * @returns A promise resolving to an ApiResponse.
 */
export const updateAdminUser = async (payload: UserAdminUpdatePayload): Promise<ApiResponse> => {
  try {
    const response = await axios.put(API_BASE_URL, payload);
    return { success: true, data: response.data, message: "User updated successfully." };
  } catch (error: any) {
    console.error('Error updating user:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update user. Please try again.',
    };
  }
};

/**
 * Deletes an Admin User (soft delete, maps to backend DELETE /:id).
 * @param id The ID of the user to delete.
 * @returns A promise resolving to an ApiResponse.
 */
export const deleteAdminUser = async (id: number | string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return { success: true, data: response.data, message: "User deleted successfully." };
  } catch (error: any) {
    console.error(`Error deleting user with ID ${id}:`, error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || `Failed to delete user with ID ${id}.`,
    };
  }
};