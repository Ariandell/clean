export const API_URL = 'http://localhost:5000/api';

export const sendChat = async (message, history = [], lang = 'UA') => {
    const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, lang })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Chat request failed');
    }
    return res.json();
};

export const api = {

    getServices: async () => {
        const res = await fetch(`${API_URL}/services/public`);
        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
    },


    submitLead: async (data) => {
        const res = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to submit lead');
        return res.json();
    },

    getLeads: async (token) => {
        const res = await fetch(`${API_URL}/leads`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch leads');
        return res.json();
    },

    updateLead: async (id, data, token) => {
        const res = await fetch(`${API_URL}/leads/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update lead');
        return res.json();
    },

    deleteLead: async (id, token) => {
        const res = await fetch(`${API_URL}/leads/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete lead');
        return res.json();
    },


    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Login failed');
        }
        return res.json();
    },


    createService: async (formData, token) => {
        const res = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to create service');
        return res.json();
    },

    updateService: async (id, formData, token) => {
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to update service');
        return res.json();
    },

    deleteService: async (id, token) => {
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete service');
        return res.json();
    },


    getPublicSettings: async () => {
        const res = await fetch(`${API_URL}/settings/public`);
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
    },

    getSettings: async (token) => {
        const res = await fetch(`${API_URL}/settings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
    },

    updateSettings: async (settings, token) => {
        const res = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        if (!res.ok) throw new Error('Failed to update settings');
        return res.json();
    }
};
