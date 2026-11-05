const API_BASE = 'http://localhost:3000/api';

const ApiService = {
    // Helper wrapper for unified error handling and headers
    async _request(endpoint, options = {}) {
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers: {
                    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                    ...options.headers
                }
            });

            const contentType = res.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await res.json() : await res.text();

            if (!res.ok) {
                console.error(`HTTP Error ${res.status} on ${endpoint}:`, data);
                return { error: data.error || `HTTP Error ${res.status}` };
            }

            return data;
        } catch (e) {
            console.error(`Network error on ${endpoint}:`, e);
            return { error: 'Network connection failed' };
        }
    },

    // Auth Endpoints (POST)
    register(userData) {
        return this._request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    login(credentials) {
        return this._request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    // Produce Endpoints (GET, POST, PUT, DELETE, PATCH)
    getProduce() {
        return this._request('/produce', { method: 'GET' });
    },

    createProduce(produceData) {
        return this._request('/produce', {
            method: 'POST',
            body: JSON.stringify(produceData)
        });
    },

    updateProduce(id, produceData) {
        return this._request(`/produce/${encodeURIComponent(id)}`, {
            method: 'PUT',
            body: JSON.stringify(produceData)
        });
    },

    deleteProduce(id) {
        return this._request(`/produce/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
    },

    approveProduce(id, is_approved) {
        return this._request(`/produce/${encodeURIComponent(id)}/approve`, {
            method: 'PATCH',
            body: JSON.stringify({ is_approved })
        });
    },

    // Farmer Count Endpoint (GET)
    getFarmersCount() {
        return this._request('/farmers/count', { method: 'GET' });
    },

    // Order Endpoints (GET, POST, PATCH)
    getOrders() {
        return this._request('/orders', { method: 'GET' });
    },

    createOrder(orderData) {
        return this._request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    updateOrderStatus(orderId, status) {
        return this._request(`/orders/${encodeURIComponent(orderId)}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
};

