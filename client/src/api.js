const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to handle user Registration
export const registerUser = async (userData) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) { return { success: false }; }
    return { success: true, data };
}

// Function to handle user By Id
export async function getUserById(id) {
    const response = await fetch(`${API_URL}/user/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return await response.json();
}

// Function to update user by ID
export async function updateUserById(id, userData) {
    const response = await fetch(`${API_URL}/user/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return await response.json();
}
