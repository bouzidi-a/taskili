// ==========================================
// API BASE CONFIGURATION
// ==========================================
// ⚠️  LEGACY / UNUSED — This file is not imported anywhere in the active app.
//     All pages make direct fetch() calls to /api/* endpoints using the Vite
//     proxy (vite.config.mjs). The axiosClient.js is a better alternative if
//     you want a centralised HTTP layer in the future.
//     Do NOT delete — kept for reference.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper function to get multipart headers (for file uploads)
const getMultipartHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    // Note: Do NOT set Content-Type for multipart/form-data. Browser sets it automatically with the boundary.
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};


// ==========================================
// 1. AUTHENTICATION
// ==========================================
export const AuthAPI = {
  // Public
  register: (data) => 
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  login: (data) => 
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  refreshToken: (data) => 
    fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  forgotPassword: (data) => 
    fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  resetPassword: (token, data) => 
    fetch(`${BASE_URL}/auth/reset-password/${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Private
  selectRole: (data) => 
    fetch(`${BASE_URL}/auth/select-role`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json())
};


// ==========================================
// 2. TASKS MANAGEMENT
// ==========================================
export const TasksAPI = {
  // Public
  getAllTasks: () => 
    fetch(`${BASE_URL}/tasks`).then(res => res.json()),

  getTaskDetails: (id) => 
    fetch(`${BASE_URL}/tasks/${id}`).then(res => res.json()),

  getRelatedTasks: (id) => 
    fetch(`${BASE_URL}/tasks/${id}/related`).then(res => res.json()),

  // Private
  createTask: (data) => 
    fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

  updateTask: (id, data) => 
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

  deleteTask: (id) => 
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => res.json()),

  changeTaskStatus: (id, statusData) => 
    fetch(`${BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    }).then(res => res.json()),

  applyForTask: (id, applicationData) => 
    fetch(`${BASE_URL}/tasks/${id}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    }).then(res => res.json()),

  getTaskApplications: (id) => 
    fetch(`${BASE_URL}/tasks/${id}/applications`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(res => res.json())
};


// ==========================================
// 3. USERS & PROFILE
// ==========================================
export const UsersAPI = {
  // Public
  getFreelancers: () => 
    fetch(`${BASE_URL}/users/freelancers`).then(res => res.json()),

  getUserProfile: (id) => 
    fetch(`${BASE_URL}/users/${id}`).then(res => res.json()),

  getFreelancerDetails: (id) => 
    fetch(`${BASE_URL}/users/freelancer/${id}`).then(res => res.json()),

  // Private
  updateMyProfile: (data) => 
    fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

  uploadProfilePhoto: (formData) => 
    fetch(`${BASE_URL}/users/me/photo`, {
      method: 'POST',
      headers: getMultipartHeaders(),
      body: formData // Expecting FormData object here
    }).then(res => res.json()),

  getMyApplications: () => 
    fetch(`${BASE_URL}/users/me/applications`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(res => res.json())
};


// ==========================================
// 4. CATEGORIES & LOCATIONS
// ==========================================
export const CategoriesAPI = {
  // Public
  getAllCategories: () => 
    fetch(`${BASE_URL}/categories`).then(res => res.json()),

  getWilayas: () => 
    fetch(`${BASE_URL}/locations/wilayas`).then(res => res.json()),

  getCommunesByWilaya: (id) => 
    fetch(`${BASE_URL}/locations/wilayas/${id}/communes`).then(res => res.json()),

  // Private (Admin)
  createCategory: (data) => 
    fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

  updateCategory: (id, data) => 
    fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json()),

  deleteCategory: (id) => 
    fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => res.json())
};


// ==========================================
// 5. REVIEWS
// ==========================================
export const ReviewsAPI = {
  // Private
  submitReview: (data) => 
    fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }).then(res => res.json())
};


// ==========================================
// 6. ADMIN
// ==========================================
export const AdminAPI = {
  // Private (Admin)
  getStats: () => 
    fetch(`${BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(res => res.json()),

  getAllUsers: () => 
    fetch(`${BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(res => res.json()),

  banOrDeleteUser: (id) => 
    fetch(`${BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(res => res.json()),

  monitorTasks: () => 
    fetch(`${BASE_URL}/admin/tasks`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(res => res.json()),

  getNewsletterSubscribers: () => 
    fetch(`${BASE_URL}/admin/newsletter`, {
      method: 'GET',
      headers: getAuthHeaders()
    }).then(res => res.json())
};
