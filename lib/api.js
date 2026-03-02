const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export const fetchAPI = async (endpoint, body, method = 'POST') => {
    // console.log(body)
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('client_token');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    if (method !== 'GET' && body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);

    // Auto logout on 401 Unauthorized
    if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('client_token');
        window.dispatchEvent(new Event('auth_unauthorized'));
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export const sendData = async (endpoint, body) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('client_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    // Auto logout on 401 Unauthorized
    if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('client_token');
        window.dispatchEvent(new Event('auth_unauthorized'));
    }

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.message || `API request failed: ${response.statusText}`;
        throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log(data)
    return true; // true means data sending successfull 
}

