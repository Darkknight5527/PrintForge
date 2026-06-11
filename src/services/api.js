const BASE_URL = 'https://printforge-api.onrender.com/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('pf_token');

// Core fetch wrapper
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ── Auth ──
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  getMe:    ()     => request('/auth/me'),
  update:   (body) => request('/auth/update',   { method: 'PUT',  body: JSON.stringify(body) }),
};

// ── Products ──
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getOne: (id) => request(`/products/${id}`),
};

// ── Orders ──
export const ordersAPI = {
  create:  (body) => request('/orders',              { method: 'POST', body: JSON.stringify(body) }),
  getMine: ()     => request('/orders/my'),
  track:   (orderId) => request(`/orders/track/${orderId}`),
  cancel:  (id)   => request(`/orders/${id}/cancel`, { method: 'PUT' }),
};

// ── Upload ──
export const uploadAPI = {
  model: (formData) => request('/upload/model', {
    method: 'POST',
    body: formData,
    headers: {}, // let browser set multipart boundary
  }),
};

// ── Payments ──
export const paymentsAPI = {
  createOrder: (orderId) => request('/payments/create-order', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verify:      (body)    => request('/payments/verify',       { method: 'POST', body: JSON.stringify(body) }),
};
