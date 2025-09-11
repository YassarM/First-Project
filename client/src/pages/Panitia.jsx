import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import {
  Plus,
  SquarePen,
  Trash2,
  CircleFadingPlus,
  Minus,
  ImagePlus,
  AwardIcon,
  LogOut,
  AppWindowMac,
  X
} from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { data, useParams } from "react-router-dom";
import {
  getKategori,
  getJuriAsjur,
  updateUserById,
  registerAsjur,
  registerUser,
  deleteUserById,
  getMotionByKategori,
  updateKategori,
  addKategori,
  deleteKategori,
  TambahMotion,
  dataPesertaPelatih,
  deletePeserta,
  updatePesertaLogo,
  addPeserta,
  deletePelatih,
  updatePeserta
} from "../api";
import { useAuth } from "../AuthContext";
import ConfirmDialog from "../Component/ConfirmDialog";
import KategoriControls from "../Component/KategoriControls";
import KategoriPopup from "../Component/KategoriPopup";
import { motion, AnimatePresence } from "framer-motion";
import MotionPopup from "../Component/MotionPopup";
import PesertaPopup from "../Component/PesertaPopup";

/* ============================================================
   Notification utilities (stack, auto-dismiss 3s)
   ============================================================ */
function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const pushNotif = (message, type = "info") => {
    if (!message) return;
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    // auto remove per item 3s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };
  const removeNotif = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return { notifications, pushNotif, removeNotif };
}

function NotificationStack({ notifications, onClose }) {
  return (
    <div
      className={`
        fixed z-50 flex flex-col space-y-3
        w-[90%] md:w-auto
        top-6 right-6
        md:right-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
      `}
    >
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className={`relative px-4 py-2 rounded-lg shadow-md text-white font-medium
              ${
                n.type === "success"
                  ? "bg-green-600"
                  : n.type === "error"
                  ? "bg-red-600"
                  : "bg-gray-700"
              }`}
          >
            {n.message}
            <button
              onClick={() => onClose(n.id)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================ */

export const EventContext = createContext();
export const JuriIdContext = createContext();

export default function Panitia() {
  const [kategori, setKategori] = useState([]);
  const [juriAsjur, setJuriAsjur] = useState([]);
  const [PP, setPP] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { event } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState();
  const [sub, setSub] = useState(false);
  const [Edited, setEdited] = useState(false);

  // notifications
  const { notifications, pushNotif, removeNotif } = useNotifications();

  useEffect(() => {
    if (event) {
      fetchJuriAsjur();
      fetchKategori();
      fetchPP();
    }
  }, [event]);

  const Refresh = (event) => {
    fetchJuriAsjur();
    fetchKategori();
    fetchPP();
  };

  /* ================ Juri & Asjur ================ */
  const fetchJuriAsjur = async () => {
    setLoading(true);
    try {
      const res = await getJuriAsjur(event);
      setJuriAsjur(res.data);
    } catch (err) {
      console.error(err);
      pushNotif("Gagal memuat data juri/asjur", "error");
    }
    setLoading(false);
  };

  const onAdd = async (role) => {
    setShowPopup(true);
    setSub(true);
    setFormData({
      nama: "",
      password: "",
      role: role
    });
  };

  const EditJuri = async (data) => {
    setFormData({
      id: data.juri_id,
      nama: data.juri_nama,
      password: "*****",
      role: "Juri"
    });
    setShowPopup(true);
    setEdited(true);
  };
  const onEditAsjur = async (data) => {
    setFormData({
      id: data.asisten_id,
      nama: data.asisten_nama,
      password: "*****",
      role: "Asjur"
    });
    setShowPopup(true);
    setEdited(true);
  };
  const onAddAsjur = async (data) => {
    setFormData({
      nama: "",
      password: "",
      nama_juri: data.juri_nama,
      role: "Asjur"
    });
    setShowPopup(true);
    setSub(true);
  };

  /* ================ Kategori ================ */
  const fetchKategori = async () => {
    setLoading(true);
    try {
      const res = await getKategori(event);
      setKategori(res.data);
    } catch (err) {
      console.error(err);
      pushNotif("Gagal memuat kategori", "error");
    }
    setLoading(false);
  };

  const addKategories = async (namaKategori) => {
    try {
      const res = await addKategori(namaKategori, event);
      if (res.data.success) {
        const newKategori = {
          id: res.data.id,
          kategori: namaKategori
        };
        setKategori((prev) => [...prev, newKategori]);
        pushNotif("Kategori berhasil ditambahkan", "success");
      } else {
        pushNotif("Gagal menambah kategori", "error");
      }
    } catch (e) {
      pushNotif("Gagal menambah kategori", "error");
    }
  };

  const onUpdate = async (id, newName) => {
    try {
      await updateKategori(id, newName);
      setKategori((prev) =>
        prev.map((item) => (item.id === id ? { ...item, kategori: newName } : item))
      );
      pushNotif("Kategori diperbarui", "success");
    } catch (e) {
      pushNotif("Gagal memperbarui kategori", "error");
    }
  };

  const handleDeleteKategori = async (id) => {
    try {
      const res = await deleteKategori(id);
      if (res.data.success) {
        pushNotif("Kategori berhasil dihapus", "success");
        fetchKategori();
      } else {
        pushNotif("Gagal menghapus kategori", "error");
      }
    } catch (e) {
      pushNotif("Gagal menghapus kategori", "error");
    }
  };

  /* ================ Peserta & Pelatih ================ */
  const fetchPP = async () => {
    setLoading(true);
    try {
      const res = await dataPesertaPelatih(event);
      setPP(res.data);
    } catch (err) {
      console.error(err);
      pushNotif("Gagal memuat peserta/pelatih", "error");
    }
    setLoading(false);
  };

  const handleDeletePelatih = async (id) => {
    try {
      await deletePelatih(id);
      pushNotif("Pelatih beserta peserta terhapus", "success");
      fetchPP();
    } catch (e) {
      pushNotif("Gagal menghapus pelatih", "error");
    }
  };

  const handleDeletePeserta = async (id) => {
    try {
      await deletePeserta(id);
      pushNotif("Peserta terhapus", "success");
      fetchPP();
    } catch (e) {
      pushNotif("Gagal menghapus peserta", "error");
    }
  };

  const onEditPelatih = async (data) => {
    setFormData({
      id: data.id_pelatih,
      nama: data.pelatih,
      password: "*****",
      role: "Pelatih"
    });
    setShowPopup(true);
  };

  return (
    <div className="bg-black min-h-screen text-white p-5 ">
      {/* Notification stack */}
      <NotificationStack notifications={notifications} onClose={removeNotif} />

      <h1 className="text-2xl font-bold mb-4">{event ? null : "Nama Event"}</h1>

      {/* === SECTION JURI ASISTEN === */}
      <EventContext.Provider value={event}>
        <SectionJuri
          title="Juri"
          items={juriAsjur}
          onAdd={() => onAdd("Juri")}
          EditJuri={EditJuri}
          onEditAsjur={onEditAsjur}
          onAddAsjur={onAddAsjur}
        />
        {/* === SECTION KATEGORI === */}
        <SectionKategori
          title="Kategori"
          items={kategori}
          onDelete={handleDeleteKategori}
          onUpdate={onUpdate}
          onAdd={addKategories}
          pushNotif={pushNotif}
        />
        {/* === SECTION Peserta dan Pelatih === */}
        <SectionPeserta
          title="Peserta"
          items={PP}
          setItems={setPP}
          onAdd={() => onAdd("Pelatih")}
          onDeletePelatih={handleDeletePelatih}
          onDeletePeserta={handleDeletePeserta}
          onEditPelatih={onEditPelatih}
          pushNotif={pushNotif}
        />
        <PopupEdit
          show={showPopup}
          formData={formData}
          setFormData={setFormData}
          setShowPopup={setShowPopup}
          sub={sub}
          setSub={setSub}
          Edited={Edited}
          setEdited={setEdited}
          setPP={setPP}
          setJuriAsjur={setJuriAsjur}
          pushNotif={pushNotif}
        />
      </EventContext.Provider>
    </div>
  );
}

/* ======================= Section Juri ======================= */

function SectionJuri({ title, items, onAdd, EditJuri, onEditAsjur, onAddAsjur }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto pb-2 border-b border-blue-500">
        <div className="flex space-x-6">
          {items.map((item) => (
            <JuriIdContext.Provider key={item.juri_id} value={item.juri_id}>
              <CardJuri
                juri={item.juri_nama}
                asisten={item.asisten_nama}
                onEditJuri={() => EditJuri(item)}
                onEditAsjur={() => onEditAsjur(item)}
                onAddAsjur={() => onAddAsjur(item)}
              />
            </JuriIdContext.Provider>
          ))}
          <AddCard onClick={onAdd} />
        </div>
      </div>
    </div>
  );
}

function CardJuri({ juri, asisten, onEditJuri, onEditAsjur, onAddAsjur }) {
  const [showKategoriPopup, setShowKategoriPopup] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-orange-500 to-yellow-400 p-4 mb-4 rounded-lg min-w-40 min-h-40 flex flex-col justify-between">
      <KategoriControls
        show={showKategoriPopup}
        onClose={() => setShowKategoriPopup(false)}
        onSave={(data) => console.log("Data kategori:", data)}
      />

      <div className="justify-between flex">
        <span className="font-bold text-gray-50 flex overflow-x-clip max-w-3/4">
          {juri}
        </span>
        <button onClick={onEditJuri} className="p-1 w-6  rounded ">
          <SquarePen size={16} className="text-gray-500 cursor-pointer" />
        </button>
      </div>

      <div className="justify-between flex">
        {asisten ? (
          <>
            <span className="font-bold text-gray-50 overflow-x-clip max-w-3/4">
              {asisten}
            </span>
            <button onClick={onEditAsjur} className="p-1 w-6  rounded">
              <SquarePen size={16} className="text-gray-500 cursor-pointer" />
            </button>
          </>
        ) : (
          <>
            <span className="font-bold text-gray-500 overflow-x-clip max-w-3/4">
              Tidak ada
            </span>
            <button onClick={onAddAsjur} className="p-1 w-6  rounded">
              <Plus size={16} className="text-gray-500 cursor-pointer" />
            </button>
          </>
        )}
      </div>
      <div className="flex mt-2 items-center justify-center">
        {asisten ? (
          <button
            onClick={() => setShowKategoriPopup(true)}
            className="p-1 rounded bg-amber-50 w-[70%] text-black font-bold text-sm cursor-pointer "
          >
            Kategori
          </button>
        ) : (
          <button
            onClick={null}
            className="p-1 rounded bg-gray-300 w-[70%] text-stone-700 font-bold text-sm "
          >
            Kategori
          </button>
        )}
      </div>
    </div>
  );
}

/* ======================= Section Kategori ======================= */

function SectionKategori({ title, items, onDelete, onUpdate, onAdd, pushNotif }) {
  const [selectedKategori, setSelectedKategori] = useState(null); // untuk edit
  const [motionData, setMotionData] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false); // khusus tambah
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletedID, setDeletedID] = useState(null);

  const handleSubmit = (newName) => {
    onUpdate(selectedKategori.id, newName);
    setSelectedKategori(null);
  };

  const handleAddSubmit = (newName) => {
    onAdd(newName);
    setShowAddPopup(false);
  };

  const onMotion = async (id) => {
    try {
      const res = await getMotionByKategori(id);
      if (res.data.success) {
        setMotionData(res.data.data);
      } else {
        setMotionData([
          {
            id: null,
            id_score: null,
            motion: "",
            nilai_1: "",
            nilai_2: "",
            nilai_3: "",
            nilai_4: "",
            nilai_5: "",
            id_kategori: id
          }
        ]);
      }
    } catch (e) {
      pushNotif("Gagal memuat motion", "error");
    }
  };

  const selectedConfirm = (bool, id) => {
    setShowConfirm(bool);
    setDeletedID(id);
  };

  const onSaveMotion = async (newMotion) => {
    try {
      await TambahMotion(newMotion);
      pushNotif("Motion tersimpan", "success");
    } catch (e) {
      pushNotif("Gagal menyimpan motion", "error");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto pb-2 border-b border-blue-500">
        <div className="flex space-x-6 ">
          {items.map((item) => (
            <CardKategori
              key={item.id}
              label={item.kategori}
              onEdit={() => setSelectedKategori(item)}
              setShowConfirm={() => selectedConfirm(true, item.id)}
              onMotion={() => onMotion(item.id)}
            />
          ))}

          {/* Tombol Tambah */}
          <AddCard onClick={() => setShowAddPopup(true)} />
        </div>
      </div>
      {motionData && (
        <MotionPopup
          motion={motionData}
          onClose={() => setMotionData(null)}
          onSave={onSaveMotion}
        />
      )}
      {selectedKategori && (
        <KategoriPopup
          onClose={() => setSelectedKategori(null)}
          namaKategori={selectedKategori.kategori}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Popup Tambah */}
      {showAddPopup && (
        <KategoriPopup
          onClose={() => setShowAddPopup(false)}
          namaKategori=""
          handleSubmit={handleAddSubmit}
        />
      )}
      {showConfirm && (
        <ConfirmDialog
          message={`Yakin ingin menghapus Kategori ?`}
          onConfirm={() => {
            onDelete(deletedID);
            setShowConfirm(false);
          }}
          setShow={() => setShowConfirm(false)}
          handleNo={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function CardKategori({ label, onEdit, setShowConfirm, onMotion }) {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 to-yellow-400 p-4 mb-4 rounded-lg min-w-40 min-h-40 flex flex-col justify-between">
      <button
        onClick={() => setShowConfirm(true)}
        className="cursor-pointer absolute top-2 right-2 w-6 h-6 z-30 bg-red-500 rounded-full flex items-center justify-center"
      >
        <Minus size={14} />
      </button>
      <button onClick={onEdit} className="p-1 abosolute top-2 left-2 rounded">
        <SquarePen size={20} className="text-gray-400 cursor-pointer" />
      </button>
      <div className="flex flex-row justify-between mt-2 ">
        <span className="font-bold text-gray-50 overflow-x-clip">{label}</span>
      </div>
      <div className="text-center">
        <button
          onClick={onMotion}
          className="min-w-25 bg-white rounded-md font-semibold text-black cursor-pointer"
        >
          Motion
        </button>
      </div>
    </div>
  );
}

/* ======================= Section Peserta ======================= */

function SectionPeserta({
  title,
  items,
  setItems,
  onAdd,
  onDeletePelatih,
  onDeletePeserta,
  onEditPelatih,
  pushNotif
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddPeserta, setShowAddPeserta] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  const [editData, setEditData] = useState(null);
  const [edited, setEdited] = useState(false);
  const { event } = useParams();

  const handleSubmitPeserta = async (data, logoFile) => {
    try {
      if (edited) {
        await updatePeserta(data.id_peserta, { nama_peserta: data.nama_peserta });

        setItems((prev) =>
          prev.map((item) =>
            item.id_peserta === data.id_peserta
              ? { ...item, peserta: data.nama_peserta }
              : item
          )
        );

        if (logoFile) {
          const formData = new FormData();
          formData.append("logo", logoFile);
          const res = await updatePesertaLogo(data.id_peserta, formData);

          setItems((prev) =>
            prev.map((item) =>
              item.id_peserta === data.id_peserta
                ? { ...item, logo: res.path || res.filePath }
                : item
            )
          );
        }

        setEdited(false);
        setEditData(null);
        pushNotif("Peserta diperbarui", "success");
      } else {
        const res = await addPeserta(data, event);
        const id_peserta = res.id_peserta;

        let newPeserta = {
          id_peserta,
          peserta: data.nama_peserta,
          logo: null,
          pelatih: data.nama_pelatih || ""
        };

        if (logoFile) {
          const formData = new FormData();
          formData.append("logo", logoFile);
          const logoRes = await updatePesertaLogo(id_peserta, formData);
          newPeserta.logo = logoRes.path || logoRes.filePath;
        }

        setItems((prev) => [...prev, newPeserta]);
        pushNotif("Peserta ditambahkan", "success");
      }
    } catch (err) {
      console.error(err);
      pushNotif("Gagal menyimpan peserta", "error");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className=" pb-2 border-b border-blue-500">
        <div className=" flex space-x-6 overflow-x-auto ">
          {items.map((item) => (
            <CardPeserta
              key={item.id_pelatih}
              pelatih={item.pelatih}
              peserta={item.peserta}
              logo={item.path}
              onEditPeserta={() => {
                setEditData(item);
                setShowAddPeserta(true);
                setEdited(true);
              }}
              onEditPelatih={() => onEditPelatih(item)}
              onDelete={() => {
                setDeletedID(item.id_pelatih);
                setShowConfirm(true);
              }}
              onAddPeserta={() => {
                setShowAddPeserta(true);
                setEditData({
                  id_pelatih: item.id_pelatih
                });
              }}
              EditLogo={() => {
                setEditData(item);
                setShowAddPeserta(true);
                setEdited(true);
              }}
            />
          ))}
          {showConfirm && (
            <ConfirmDialog
              message={`Yakin ingin menghapus Pelatih bersama Peserta ?`}
              onConfirm={() => {
                onDeletePelatih(deletedID);
                setShowConfirm(false);
              }}
              setShow={() => setShowConfirm(false)}
              handleNo={() => setShowConfirm(false)}
            />
          )}
          {showAddPeserta && (
            <PesertaPopup
              isOpen={showAddPeserta}
              onClose={() => {
                setShowAddPeserta(false);
                setEditData(null);
              }}
              onSubmit={(formData, logoFile) => {
                handleSubmitPeserta(formData, logoFile);
                setShowAddPeserta(false);
              }}
              initialData={editData}
            />
          )}
          <AddCard onClick={onAdd} />
        </div>
      </div>
    </div>
  );
}

function CardPeserta({
  pelatih,
  peserta,
  logo,
  onEditPeserta,
  onEditPelatih,
  onDelete,
  onAddPeserta,
  EditLogo
}) {
  return (
    <div className="relative w-50 h-50 flex flex-col p-4 items-center ">
      {/* Foto Peserta kiri atas */}
      {logo ? (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${logo}`}
          alt="Foto Peserta"
          className="absolute top-1 left-1 w-12 h-12 rounded-full object-cover shadow-md z-20 "
        />
      ) : (
        <div className="cursor-pointer absolute top-1 left-1 w-12 h-12 rounded-full object-cover shadow-md z-20 bg-gray-300 flex items-center justify-center">
          <ImagePlus onClick={EditLogo} size={24} className="text-white" />
        </div>
      )}

      {/* Card isi */}
      <div className="relative bg-gradient-to-br from-orange-500 to-yellow-400 p-4 rounded-lg w-full flex flex-col justify-end items-center">
        {/* Tombol Delete kanan atas */}
        <button
          onClick={onDelete}
          className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 z-30 bg-red-500 rounded-full flex items-center justify-center"
        >
          <Minus size={14} />
        </button>

        {/* Isi dari tengah ke bawah */}
        <div className="w-full mt-12 space-y-2">
          {/* Pelatih */}
          <div className="flex justify-between items-center font-bold text-gray-50">
            <span className="truncate">{pelatih}</span>
            <button onClick={onEditPelatih} className="p-1 w-6  rounded ml-2 shrink-0">
              <SquarePen size={16} className="text-gray-500 cursor-pointer" />
            </button>
          </div>

          {/* Peserta */}
          {peserta ? (
            <div className="flex justify-between items-center font-bold text-gray-50">
              <span className="truncate overflow-x-clip">{peserta}</span>
              <button onClick={onEditPeserta} className="p-1 w-6  rounded ml-2 shrink-0">
                <SquarePen size={16} className="text-gray-500 cursor-pointer" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center font-bold text-gray-50">
                <span className="font-bold text-gray-500 overflow-x-clip max-w-3/4">
                  Tidak ada
                </span>
                <button onClick={onAddPeserta} className="p-1 w-6  rounded">
                  <Plus size={16} className="text-gray-500 cursor-pointer" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================= Common ======================= */

function AddCard({ onClick }) {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-yellow-400 min-w-30 h-30 mb-4 mt-6  rounded-lg flex items-center justify-center font-bold">
      <CircleFadingPlus
        className="transition-transform duration-200 hover:scale-140 cursor-pointer"
        size={33}
        onClick={onClick}
      />
    </div>
  );
}

/* ======================= Popup Edit ======================= */

function PopupEdit({
  show,
  formData,
  setFormData,
  setShowPopup,
  sub,
  setSub,
  Edited,
  setEdited,
  setPP,
  setJuriAsjur,
  pushNotif
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { event } = useParams();

  const handleSave = () => {
    let payload = { username: formData.nama };
    if (formData.password !== "*****") {
      payload.password = formData.password;
    }

    if (formData.role === "Pelatih") {
      setPP((prev) =>
        prev.map((item) =>
          item.id_pelatih === formData.id ? { ...item, pelatih: formData.nama } : item
        )
      );
    }
    if (formData.role === "Juri") {
      setJuriAsjur((prev) =>
        prev.map((item) =>
          item.juri_id === formData.id ? { ...item, juri_nama: formData.nama } : item
        )
      );
    }
    if (formData.role === "Asjur") {
      setJuriAsjur((prev) =>
        prev.map((item) =>
          item.asisten_id === formData.id ? { ...item, asisten_nama: formData.nama } : item
        )
      );
    }

    updateUserById(formData.id, payload);
    pushNotif("Perubahan disimpan", "success");
    setShowPopup(false);
    setEdited(false);
  };

  const handleCancel = () => {
    setFormData({
      id: null,
      nama: "",
      password: "*****"
    });
    setShowPopup(false);
    setEdited(false);
    setSub(false);
  };

  const handleSubmit = async () => {
    try {
      let payload = {
        username: formData.nama,
        password: formData.password,
        role: formData.role,
        juri: formData.nama_juri
      };
      let res;
      if (payload.role === "Asjur") {
        res = await registerAsjur(payload);
      }
      if (payload.role === "Juri" || payload.role === "Pelatih") {
        payload = {
          ...payload,
          namaEvent: event
        };
        res = await registerUser(payload);
      }

      if (res?.data?.success) {
        pushNotif(`${payload.role} berhasil ditambahkan`, "success");
        setShowPopup(false);
      } else {
        pushNotif(`Gagal menambahkan ${payload.role}`, "error");
      }
      setEdited(false);
      setSub(false);
    } catch (err) {
      pushNotif("Gagal submit data", "error");
    }
  };

  const onBDClick = () => {
    setShowPopup(false);
    setShowConfirm(true);
  };

  const onDelete = () => {
    deleteUserById(formData.id);
    setShowConfirm(false);
    setEdited(false);
    pushNotif("Data dihapus", "success");
  };

  const handleNo = () => {
    setShowConfirm(false);
    setEdited(false);
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-xl shadow-lg w-80 h-80 ">
            {Edited && (
              <>
                <button
                  onClick={onBDClick}
                  className="cursor-pointer absolute -top-2.5 -right-2.5 w-8 h-8 z-30 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
              </>
            )}
            <div className="mb-7 mt-5">
              <label className="text-white block mb-1 text-center font-semibold">
                Nama
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 rounded-full outline-none font-semibold bg-white text-black"
              />
            </div>
            <div className="mb-4">
              <label className="text-white block mb-1 text-center font-semibold">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-full outline-none font-semibold bg-white text-black"
              />
            </div>
            <div className="flex justify-center gap-8 mt-13">
              {sub ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="bg-white text-orange-600 font-semibold px-4 py-1 w-25 rounded-full cursor-pointer"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-white text-orange-600 font-semibold px-4 py-1 w-25 rounded-full cursor-pointer"
                  >
                    Save
                  </button>
                </>
              )}
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white font-semibold px-4 py-1 w-25 rounded-full cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && (
        <ConfirmDialog
          message="Yakin ingin menghapus data ini?"
          onConfirm={onDelete}
          setShow={() => setShowConfirm(false)}
          handleNo={handleNo}
        />
      )}
    </>
  );
}
