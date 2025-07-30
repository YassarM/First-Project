import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to handle user Registration
export const registerUser = async (userData) => await axios.post(`${API_BASE_URL}/register`, userData, { withCredentials: true });

export const registerAsjur = async (AsjurData) => {
    axios.post(`${API_BASE_URL}/register-asjur`, { AsjurData }, { withCredentials: true })
}
// Function to handle user By Id
export async function getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
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

export async function deleteUserById(id) {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return await response.json();
}

// Submit InputPBB data to the server


// Submit InputVariasi.page data to the server
export const submitNilaiToServer = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/input-nilai`, { data }, { withCredentials: true })
        if (!response.data) throw new Error('Gagal simpan data')

    } catch (err) {
        console.log(err)
    }
}

// Function to fetch peserta
export const dataPeserta = async () => await axios.get(`${API_BASE_URL}/peserta`, { withCredentials: true });;


export const statusPeserta = async (id, id_user) => await axios.post(`${API_BASE_URL}/status/${id}`, { user_id: id_user }, { withCredentials: true })

export const gradedJuri = async (id, id_user) => {
    const res = await fetch(`${API_BASE_URL}/grading-status/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id_juri: id_user })
    })
}

export const ungradedStatus = async (id, user_id) => {
    const res = await axios.post(`${API_BASE_URL}/ungraded/${id}`, { user_id }, { withCredentials: true })
}

export const getAllUsers = async () => await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });

export const getRolesUser = async () => {
    return await axios.get(`${API_BASE_URL}/roles`, { withCredentials: true })
}

export const getUsersRoleJuri = async () => await axios.get(`${API_BASE_URL}/user-role-juri`, { withCredentials: true })

export const registerPelatih = async (pelatihData) => {
    await axios.post(`${API_BASE_URL}/register`, pelatihData, { withCredentials: true })
}

export const getAllPelatih = async () => await axios.get(`${API_BASE_URL}/all-pelatih`, { withCredentials: true });

export const deletePelatih = async (id) => {
    await axios.delete(`${API_BASE_URL}/delete-pelatih/${id}`, { withCredentials: true })
}
export const inputPeserta = async (data) => await axios.post(`${API_BASE_URL}/input-peserta`, data, { withCredentials: true })

export const deletePeserta = async (id) => {
    await axios.delete(`${API_BASE_URL}/peserta/${id}`, { withCredentials: true })
}
export const getPesertaById = async (id) => await axios.get(`${API_BASE_URL}/peserta/by-pelatih/${id}`, { withCredentials: true })

export const uploadLogo = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/upload-logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        console.log("Logo uploaded di API:", response.data);
        return response.data; // { filename: 'logo.png' }
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
    }
}

export const getKategori = async () => await axios.get(`${API_BASE_URL}/motion/kategori`, { withCredentials: true });

export const addKategori = async (nama, prioritas) => await axios.post(`${API_BASE_URL}/motion/tambah/kategori`, { nama, prioritas }, { withCredentials: true });


export const getJuriByAsjur = async () => await axios.get(`${API_BASE_URL}/juri-by-asjur`, { withCredentials: true });

export const inputNotesAsjur = async (id, note, id_user) => await axios.post(`${API_BASE_URL}/peserta/${id}/note`, { note, id_user }, { withCredentials: true });

export const getNilaiPesertaById = async (id) => await axios.get(`${API_BASE_URL}/nilai/peserta/${id}`, { withCredentials: true });

export const deleteMotion = async (id) => await axios.delete(`${API_BASE_URL}/motion-delete/${id}`, { withCredentials: true });

export const postMotionByKategori = async (data) => await axios.post(`${API_BASE_URL}/motion`, data, { withCredentials: true });

export const postTambahMotion = async (data) => await axios.post(`${API_BASE_URL}/motion-input`, data, { withCredentials: true });

export const updateKategori = async (id, nama_kategori, prioritas) => {
    return await axios.patch(`${API_BASE_URL}/motion/kategori/${id}`, { nama: nama_kategori, prioritas }, { withCredentials: true });
}
export const deleteKategori = async (id) => {
    return await axios.delete(`${API_BASE_URL}/motion/kategori/${id}`, { withCredentials: true });
}

export const getScores = async () =>
  await axios.get(`${API_BASE_URL}/scores`, { withCredentials: true });