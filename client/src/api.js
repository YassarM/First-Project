import axios from "axios";
import { data } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/* Updated API Start */
export const getPanitia = async () => await axios.get(`${API_BASE_URL}/panitia`, { withCredentials: true });
export const getAllEvents = async () => await axios.get(`${API_BASE_URL}/all-events`, { withCredentials: true });
export const namaEvents = async (id) => await axios.post(`${API_BASE_URL}/nama-event/${id}`)
export const tambahEvent = async (eventData) => await axios.post(`${API_BASE_URL}/tambah-event`, eventData, { withCredentials: true })
export const pesertaPelatih = async (nama_event) => await axios.get(`${API_BASE_URL}/${nama_event}/peserta-pelatih`)
export const deleteEventById = async (id) => await axios.delete(`${API_BASE_URL}/event/${id}`, { withCredentials: true });
export const updateEventById = async (id, eventData) => await axios.patch(`${API_BASE_URL}/update/event/${id}`, { eventData }, { withCredentials: true });
export const userOnlineActivity = async()=> await axios.get(`${API_BASE_URL}/users/online`, { withCredentials: true });

export const getJuriAsjur = async (nama_event) => await axios.get(`${API_BASE_URL}/${nama_event}/juri-asjur`)

export const updateUserById = async (id, userData) => await axios.patch(`${API_BASE_URL}/update/user/${id}`, { userData }, { withCredentials: true });

export const tryLogin = async (username, password) => await axios.post(`${API_BASE_URL}/login`, { username, password }, { withCredentials: true })

export const tryLogout = async () => await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });

export const registerAsjur = async (AsjurData) => axios.post(`${API_BASE_URL}/register-asjur`, { AsjurData }, { withCredentials: true })

export const registerUser = async (userData) => await axios.post(`${API_BASE_URL}/register`, userData, { withCredentials: true });

export const deleteUserById = async (id) => await axios.delete(`${API_BASE_URL}/user/${id}`, { withCredentials: true })

export const getKategori = async (event) => await axios.get(`${API_BASE_URL}/get/kategori/${event}`, { withCredentials: true });

export const getkategoriControl = async (id) => await axios.get(`${API_BASE_URL}/get/kategori/control/${id}`, { withCredentials: true })
export const KategoriControl = async (id, data) => await axios.post(`${API_BASE_URL}/kategori/control/${id}`, { data }, { withCredentials: true })
export const removeKategoriControl = async (id) => await axios.delete(`${API_BASE_URL}/remove/kategori/control/${id}`, { withCredentials: true })
export const updateKategori = async (id, newName) => await axios.patch(`${API_BASE_URL}/${id}/${newName}`, { withCredentials: true })
export const getMotionByKategori = async (id_kategori) => await axios.get(`${API_BASE_URL}/motion/${id_kategori}`, { withCredentials: true });
export const addKategori = async (nama, event) => await axios.post(`${API_BASE_URL}/tambah/kategori/${nama}/${event}`, { withCredentials: true });
export const deleteKategori = async (id) => await axios.delete(`${API_BASE_URL}/delete/kategori/${id}`, { withCredentials: true });
export const getKategoriByJuri = async (id_juri) => await axios.get(`${API_BASE_URL}/kategori-by-juri/${id_juri}`, { withCredentials: true });

export const TambahMotion = async (data) => await axios.post(`${API_BASE_URL}/motion-input`, data, { withCredentials: true });

export const dataPeserta = async (event) => await axios.get(`${API_BASE_URL}/peserta/${event}`, { withCredentials: true });;
export const dataPesertaPelatih = async (event) => await axios.get(`${API_BASE_URL}/pelatih/peserta/${event}`, { withCredentials: true });
export const deletePelatih = async (id) => await axios.delete(`${API_BASE_URL}/delete-pelatih/${id}`, { withCredentials: true })
export const deletePeserta = async (id) => await axios.delete(`${API_BASE_URL}/peserta/${id}`, { withCredentials: true })
export const addPeserta = async (data, event) => await axios.post(`${API_BASE_URL}/input-peserta/${event}`, data, { withCredentials: true })
export const updatePeserta = async (id,data) => await axios.patch(`${API_BASE_URL}/update/peserta/${id}`,  data , { withCredentials: true })
export const updatePesertaLogo = async (id_peserta, formData) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/peserta/${id_peserta}/logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const getJuriByAsjur = async () => await axios.get(`${API_BASE_URL}/juri-by-asjur`, { withCredentials: true });
export const statusPeserta = async (id, id_user) => await axios.post(`${API_BASE_URL}/status/${id}`, { user_id: id_user }, { withCredentials: true })
export const inputNotesAsjur = async (id, note, id_user) => await axios.post(`${API_BASE_URL}/peserta/${id}/note`, { note, id_user }, { withCredentials: true });
export const gradedJuri = async (id, id_user) => await axios.patch(`${API_BASE_URL}/grading-status/${id}`, { id_juri: id_user }, { withCredentials: true })
export const submitNilaiToServer = async (data) => await axios.post(`${API_BASE_URL}/input-nilai`, { data }, { withCredentials: true })

/* Updated API End */


export const getUserById = async (id) => await axios.get(`${API_BASE_URL}/user/${id}`, { withCredentials: true });


// Function to fetch peserta



export const ungradedStatus = async (id, user_id) => await axios.post(`${API_BASE_URL}/ungraded/${id}`, { user_id }, { withCredentials: true })


export const getAllUsers = async () => await axios.get(`${API_BASE_URL}/users`, { withCredentials: true });

export const getRolesUser = async () => await axios.get(`${API_BASE_URL}/roles`, { withCredentials: true })

export const getUsersRoleJuri = async () => await axios.get(`${API_BASE_URL}/user-role-juri`, { withCredentials: true })

export const registerPelatih = async (pelatihData) => await axios.post(`${API_BASE_URL}/register`, pelatihData, { withCredentials: true })

export const getAllPelatih = async () => await axios.get(`${API_BASE_URL}/all-pelatih`, { withCredentials: true });




export const getPesertaById = async (id) => await axios.get(`${API_BASE_URL}/peserta/by-pelatih/${id}`, { withCredentials: true })







export const getNilaiPesertaById = async (id) => await axios.get(`${API_BASE_URL}/nilai/peserta/${id}`, { withCredentials: true });

export const deleteMotion = async (id) => await axios.delete(`${API_BASE_URL}/motion-delete/${id}`, { withCredentials: true });

export const postTambahKategori = async (data) => await axios.post(`${API_BASE_URL}/kategori/add`, data, { withCredentials: true });

export const getScores = async () => await axios.get(`${API_BASE_URL}/scores`, { withCredentials: true });

export const updatePrioritas = async (id, prioritas) => await axios.patch(`${API_BASE_URL}/motion/kategori/${id}/prioritas`, { prioritas }, { withCredentials: true });

export const updateScore = async (motionId, scores) => await axios.patch(`${API_BASE_URL}/motion/score/${motionId}`, { scores }, { withCredentials: true })

export const getAllMotion = () => axios.get(`${API_BASE_URL}/motion/all`, { withCredentials: true });

export const updateMotion = async (id, data) => await axios.patch(`${API_BASE_URL}/motion/update/${id}`, data, { withCredentials: true });
