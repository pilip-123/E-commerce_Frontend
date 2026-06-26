const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

async function request(method, url, data = null, params = null) {
  const token = localStorage.getItem('ecommerce_token');
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const response = await fetch(`${baseURL}${url}${buildQuery(params ?? {})}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data ? (isFormData ? data : JSON.stringify(data)) : null,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message ?? 'Request failed.');
    error.response = { data: payload, status: response.status };
    throw error;
  }

  return { data: payload };
}

const api = {
  get(url, config = {}) {
    return request('GET', url, null, config.params);
  },
  post(url, data) {
    return request('POST', url, data);
  },
  patch(url, data) {
    return request('PATCH', url, data);
  },
  delete(url) {
    return request('DELETE', url);
  },
};

export default api;
