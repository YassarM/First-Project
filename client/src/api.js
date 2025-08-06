import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const tryLogin = async (username, password) => await axios.post(`${API_BASE_URL}/login`, { username, password }, { withCredentials: true })

export const tryLogout = async () => await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
// Function to handle user Registration
export const registerUser = async (userData) => await axios.post(`${API_BASE_URL}/register`, userData, { withCredentials: true });

export const registerAsjur = async (AsjurData) => axios.post(`${API_BASE_URL}/register-asjur`, { AsjurData }, { withCredentials: true })

// Function to handle user By Id
export const getUserById = async (id) => await axios.get(`${API_BASE_URL}/user/${id}`, { withCredentials: true });

// Function to update user by ID
export const updateUserById = async (id, userData) => await axios.patch(`${API_BASE_URL}/user/${id}`, { userData }, { withCredentials: true });


export const deleteUserById = async (id) => await axios.delete(`${API_BASE_URL}/user/${id}`, { withCredentials: true })

export const submitNilaiToServer = async (data) => await axios.post(`${API_BASE_URL}/input-nilai`, { data }, { withCredentials: true })

// Function to fetch peserta
export const dataPeserta = async () => await axios.get(`${API_BASE_URL}/peserta`, { withCredentials: true });;


export const statusPeserta = async (id, id_user) => await axios.post(`${API_BASE_URL}/status/${id}`, { user_id: id_user }, { withCredentials: true })

export const ungradedStatus = async (id, user_id) => await axios.post(`${API_BASE_URL}/ungraded/${id}`, { user_id }, { withCredentials: true })

export const gradedJuri = async (id, id_user) => await axios.patch(`${API_BASE_URL}/grading-status/${id}`, { id_juri: id_user }, { withCredentials:true })

export const getAllUsers = async () => await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });

export const getRolesUser = async () => await axios.get(`${API_BASE_URL}/roles`, { withCredentials: true })

export const getUsersRoleJuri = async () => await axios.get(`${API_BASE_URL}/user-role-juri`, { withCredentials: true })

export const registerPelatih = async (pelatihData) => await axios.post(`${API_BASE_URL}/register`, pelatihData, { withCredentials: true })

export const getAllPelatih = async () => await axios.get(`${API_BASE_URL}/all-pelatih`, { withCredentials: true });

export const deletePelatih = async (id) => await axios.delete(`${API_BASE_URL}/delete-pelatih/${id}`, { withCredentials: true })

export const inputPeserta = async (data) => await axios.post(`${API_BASE_URL}/input-peserta`, data, { withCredentials: true })

export const deletePeserta = async (id) => await axios.delete(`${API_BASE_URL}/peserta/${id}`, { withCredentials: true })

export const getPesertaById = async (id) => await axios.get(`${API_BASE_URL}/peserta/by-pelatih/${id}`, { withCredentials: true })

export const uploadLogo = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/upload-logo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
    return response.data; // { filename: 'logo.png' }

}

export const getKategori = async () => await axios.get(`${API_BASE_URL}/motion/kategori`, { withCredentials: true });

export const addKategori = async (nama, prioritas) => await axios.post(`${API_BASE_URL}/motion/tambah/kategori`, { nama, prioritas }, { withCredentials: true });


export const getJuriByAsjur = async () => await axios.get(`${API_BASE_URL}/juri-by-asjur`, { withCredentials: true });

export const inputNotesAsjur = async (id, note, id_user) => await axios.post(`${API_BASE_URL}/peserta/${id}/note`, { note, id_user }, { withCredentials: true });

export const getNilaiPesertaById = async (id) => await axios.get(`${API_BASE_URL}/nilai/peserta/${id}`, { withCredentials: true });

export const deleteMotion = async (id) => await axios.delete(`${API_BASE_URL}/motion-delete/${id}`, { withCredentials: true });

export const postMotionByKategori = async (id_kategori) => await axios.post(`${API_BASE_URL}/motion`, {id_kategori}, { withCredentials: true });

export const postTambahMotion = async (data) => await axios.post(`${API_BASE_URL}/motion-input`, data, { withCredentials: true });

export const postTambahKategori = async (data) => await axios.post(`${API_BASE_URL}/kategori/add`, data, { withCredentials: true });


export const updateKategori = async (id, { nama_kategori, prioritas }) => await axios.patch(`${API_BASE_URL}/motion/kategori/${id}`, { nama: nama_kategori, prioritas }, { withCredentials: true });

export const deleteKategori = async (id) => await axios.delete(`${API_BASE_URL}/motion/delete/kategori/${id}`, { withCredentials: true });

export const getScores = async () => await axios.get(`${API_BASE_URL}/scores`, { withCredentials: true });

export const updatePrioritas = async (id, prioritas) => await axios.patch(`${API_BASE_URL}/motion/kategori/${id}/prioritas`, { prioritas }, { withCredentials: true });

export const updateScore = async (motionId, scores) => await axios.patch(`${API_BASE_URL}/motion/score/${motionId}`, {scores}, {withCredentials: true})

export const getAllMotion = () => axios.get(`${API_BASE_URL}/motion/all`, { withCredentials: true });

export const updateMotion = async (id, data) => await axios.patch(`${API_BASE_URL}/motion/update/${id}`, data, { withCredentials: true });
