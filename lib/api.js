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
        throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export const sendData = async (endpoint, body) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMessage = data.message;
        throw new Error(`API request failed: ${errorMessage}`);
    }
    console.log(data)
    return true; // true means data sending successfull 
}

