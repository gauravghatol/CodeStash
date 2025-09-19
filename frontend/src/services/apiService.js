import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
});

// Attach JWT to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codestash_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Placeholder endpoints
export async function login(credentials) {
  // POST /users/login
  const { data } = await api.post('/users/login', credentials);
  // expect { token, user }
  return data;
}

export async function signup(userData) {
  // POST /users/register
  const { data } = await api.post('/users/register', userData);
  return data;
}

// OTP endpoints
export async function verifyOtp({ email, code, purpose }) {
  const { data } = await api.post('/users/verify-otp', { email, code, purpose });
  return data;
}

export async function resendOtp({ email, purpose = 'signup' }) {
  const { data } = await api.post('/users/resend-otp', { email, purpose });
  return data;
}

export async function forgotPassword(email) {
  const { data } = await api.post('/users/forgot-password', { email });
  return data;
}

export async function resetPassword({ email, code, newPassword }) {
  const { data } = await api.post('/users/reset-password', { email, code, newPassword });
  return data;
}

export async function fetchAllSnippets(query = {}) {
  // GET /snippets?search=...&language=...
  const { data } = await api.get('/snippets', { params: query });
  return data; // expect array
}

export async function fetchSnippetById(id) {
  const { data } = await api.get(`/snippets/${id}`);
  return data; // expect object
}

export async function createSnippet(snippetData) {
  const { data } = await api.post('/snippets', snippetData);
  return data; // expect created object
}

export async function updateSnippet(id, snippetData) {
  const { data } = await api.put(`/snippets/${id}`, snippetData);
  return data;
}

export async function deleteSnippet(id) {
  const { data } = await api.delete(`/snippets/${id}`);
  return data;
}

export async function likeSnippet(id) {
  const { data } = await api.put(`/snippets/${id}/like`);
  return data;
}

export async function fetchUserSnippets(userId) {
  const { data } = await api.get(`/users/${userId}/snippets`);
  return data; // expect array
}

export default api;
