import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Key, Trash2, Pencil } from "lucide-react";
import {
    getAllEvents,
    getPanitia,
    registerUser,
    deleteUserById,
    deleteEventById,
    updateEventById,
    tambahEvent as addEvent,
    userOnlineActivity,
} from "../api";

// 🔔 NotificationStack
function NotificationStack({ notifications, removeNotif }) {
    return (
        <div
            className={`
        fixed z-100 flex flex-col space-y-3
        w-[90%] md:w-auto
        top-6 right-6 md:right-auto
        md:top-6 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        
      `}
        >
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.3 }}
                        className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${notif.type === "success" ? "bg-green-600" : "bg-red-600"
                            }`}
                    >
                        {notif.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default function AdminPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [events, setEvents] = useState([]);
    const [panitia, setPanitia] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [openEvent, setOpenEvent] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editingPassword, setEditingPassword] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [now, setNow] = useState(new Date());
    const [editNamaEvent, setEditNamaEvent] = useState(false);
    // 🔔 helper push notif
    const pushNotif = (message, type) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeNotif(id), 3000);
    };

    const removeNotif = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    // countdown updater tiap detik
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const res = await userOnlineActivity();
                setOnlineUsers(res.data.map((u) => u.id_user));
            } catch (err) {
                console.error("❌ Gagal fetch online users:", err);
            }
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAddEvent = async (newEvent) => {
        try {
            const res = await addEvent({
                nama_event: newEvent.nama_event,
                event_start: newEvent.date,
            });

            if (res.data.success) {
                setEvents((prev) => [...prev, res.data.event]);
                pushNotif(`Berhasil Tambah ${newEvent.nama_event}`, "success");
            } else {
                pushNotif(newEvent.message, newEvent.type);
            }
        } catch (err) {
            pushNotif(newEvent.message, newEvent.type);
        }
    };

    const handleDeleteEvent = async (id) => {
        const event = events.find((ev) => ev.id_event === id);
        try {
            await deleteEventById(id);
            setEvents((prev) => prev.filter((ev) => ev.id_event !== id));
            pushNotif(`${event.nama_event} berhasil dihapus`, "success");
        } catch (err) {
            console.error("❌ Gagal tambah event:", err);
            pushNotif(`Gagal tambah ${event.nama_event}`, "error");
        }

    };

    const handleUpdateEvent = async (id, updatedData) => {
        try {
            const mysqlDateTime = updatedData.event_start.replace("T", " ") + ":00";
            const payload = { ...updatedData, event_start: mysqlDateTime };
            const res = await updateEventById(id, payload);

            if (res.data.success) {
                setEvents((prev) =>
                    prev.map((ev) =>
                        ev.id_event === id
                            ? { ...ev, ...updatedData, event_start: mysqlDateTime  }
                            : ev
                    )
                );
                pushNotif(`${updatedData.nama_event} berhasil diupdate`, "success");
            }
        } catch (err) {
            console.error("❌ Gagal update event:", err);
            pushNotif(`Gagal update ${updatedData.nama_event}`, "error");
        }
    };

    const handleAddUser = async (data, eventNama) => {
        try {
            const res = await registerUser({
                ...data,
                role: "Panitia",
                namaEvent: eventNama,
            });
            const newUser = {
                id: res?.data?.user?.id_user ?? Date.now(),
                username: data.username,
                role: "Panitia",
                date: new Date().toISOString(),
                status: "Offline",
                nama_event: eventNama,
            };
            setPanitia((prev) => [...prev, newUser]);
            pushNotif(`${newUser.username} berhasil ditambahkan`, "success");
        } catch (err) {
            console.error("❌ Gagal tambah user:", err);
            pushNotif("Gagal tambah user", "error");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUserById(id);
            setPanitia((prev) => prev.filter((u) => u.id !== id));
            pushNotif("User berhasil dihapus", "success");
        } catch (err) {
            console.error("❌ Gagal hapus user:", err);
            pushNotif("Gagal hapus user", "error");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsRes = await getAllEvents();
                const normalizedEvents = eventsRes.data.map((ev) => ({
                    ...ev,
                    event_start: ev.event_start.replace(" ", "T"),
                }));
                setEvents(normalizedEvents);

                const panitiaRes = await getPanitia();
                setPanitia(panitiaRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const getCountdown = (targetDate) => {
        const safeDate = new Date(targetDate);
        const diff = safeDate - now;

        if (diff <= 0) {
            const daysPassed = Math.floor((now - safeDate) / (1000 * 60 * 60 * 24));
            if (daysPassed > 3) {
                return "Event finished";
            }
            return "Event started!";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center py-6 gap-6">
            <NotificationStack notifications={notifications} removeNotif={removeNotif} />

            <button
                onClick={() => setShowAddEvent(true)}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg shadow font-semibold cursor-pointer"
            >
                Tambah Event
            </button>

            <AddEventPopup show={showAddEvent} setShow={setShowAddEvent} onSubmit={handleAddEvent} />

            <AnimatePresence>
                {events.map((event) => (
                    <motion.div
                        key={event.id_event}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-4/5"
                    >
                        {/* Orange Block */}
                        <motion.div
                            className={`${getCountdown(event.event_start) === "Event finished"
                                ? "bg-gray-600"
                                : "bg-gradient-to-r from-orange-500 to-orange-600"
                                } text-white p-4 cursor-pointer flex justify-between items-center ${openEvent === event.id_event ? "rounded-t-lg" : "rounded-lg"
                                }`}
                            onClick={() =>
                                setOpenEvent((prev) => (prev === event.id_event ? null : event.id_event))
                            }
                        >
                            <div className="flex flex-col">
                                {editNamaEvent ? (
                                    <input
                                        type="text"
                                        defaultValue={event.nama_event}
                                        onBlur={() => setEditNamaEvent(false)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-2 py-1 rounded border border-gray-400 text-white font-semibold"
                                    />
                                ) : (

                                    <h2 className="text-lg font-semibold">{event.nama_event}</h2>

                                )}
                                <span className="text-sm text-gray-100">
                                    {getCountdown(event.event_start)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="datetime-local"
                                    value={new Date(event.event_start).toISOString().slice(0, 16)}
                                    onChange={(e) =>
                                        handleUpdateEvent(event.id_event, {
                                            ...event,
                                            event_start: e.target.value,
                                        })
                                    }
                                    onClick={(e) => {
                                        e.target.showPicker();
                                        e.stopPropagation();
                                    }}
                                    className="px-2 py-1 rounded-lg text-black"
                                />
                                <Trash2
                                    size={20}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteEvent(event.id_event);
                                    }}
                                    className="cursor-pointer ml-5 mr-3 text-black hover:text-gray-800"
                                />
                            </div>
                        </motion.div>

                        {/* Gray Block */}
                        <AnimatePresence>
                            {openEvent === event.id_event && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="overflow-hidden bg-gray-300 p-4 rounded-b-lg"
                                >
                                    <AnimatePresence>
                                        {panitia
                                            .filter((u) => u.nama_event === event.nama_event)
                                            .map((user) => {
                                                const isOnline = onlineUsers.includes(user.id);
                                                return (
                                                    <motion.div
                                                        key={user.id}
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 50 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="grid grid-cols-6 items-center bg-gray-200 p-3 rounded-lg mb-2"
                                                    >
                                                        {/* Username */}
                                                        {editingUser === user.id ? (
                                                            <input
                                                                type="text"
                                                                defaultValue={user.username}
                                                                onBlur={() => setEditingUser(null)}
                                                                className="px-2 py-1 rounded border border-gray-400"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <span
                                                                onClick={() => setEditingUser(user.id)}
                                                                className="cursor-pointer font-medium"
                                                            >
                                                                {user.username}
                                                            </span>
                                                        )}

                                                        <span>{user.role}</span>

                                                        <span>
                                                            {new Date(user.date).toLocaleString("en-GB", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>

                                                        {editingPassword === user.id ? (
                                                            <input
                                                                type="password"
                                                                placeholder="New password"
                                                                onBlur={() => setEditingPassword(null)}
                                                                className="px-2 py-1 rounded border border-gray-400"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <Key
                                                                size={18}
                                                                onClick={() => setEditingPassword(user.id)}
                                                                className="cursor-pointer"
                                                            />
                                                        )}

                                                        <Trash2
                                                            size={18}
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="cursor-pointer text-red-600 hover:text-red-800"
                                                        />

                                                        <div className="flex items-center gap-2 justify-end">
                                                            <span className="font-medium w-16 text-right">
                                                                {isOnline ? "Online" : "Offline"}
                                                            </span>
                                                            <span
                                                                className={`w-4 h-4 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"
                                                                    }`}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                    </AnimatePresence>

                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/${event.nama_event}/Panitia-page`);
                                            }}
                                            className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium shadow cursor-pointer"
                                        >
                                            Panitia Page
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowPopup(true);
                                            }}
                                            className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium shadow cursor-pointer"
                                        >
                                            Add User
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditNamaEvent(true)
                                            }}
                                            className="bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium shadow cursor-pointer"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        {showPopup && (
                                            <AddUserPopup
                                                show={showPopup}
                                                setShowPopup={setShowPopup}
                                                onSubmit={(formData) => handleAddUser(formData, event.nama_event)}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// Popup Add User
function AddUserPopup({ show, setShowPopup, onSubmit }) {
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleSubmit = () => {
        if (!formData.username.trim() || !formData.password.trim()) {
            alert("Nama dan Password wajib diisi!");
            return;
        }
        onSubmit(formData);
        setFormData({ username: "", password: "" });
        setShowPopup(false);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowPopup(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-xl shadow-lg w-80"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <div className="mb-5">
                            <label className="text-white block mb-1 text-center font-semibold">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-full outline-none font-semibold bg-white text-black"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-white block mb-1 text-center font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-full outline-none font-semibold bg-white text-black"
                            />
                        </div>

                        <div className="flex justify-center gap-6">
                            <button
                                onClick={handleSubmit}
                                className="bg-white text-orange-600 font-semibold px-5 py-1 rounded-full cursor-pointer"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-red-600 text-white font-semibold px-5 py-1 rounded-full cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Popup Add Event
function AddEventPopup({ show, setShow, onSubmit }) {
    const [formData, setFormData] = useState({ nama_event: "", date: "" });

    const handleSubmit = () => {
        if (!formData.nama_event.trim()) {
            onSubmit({ message: "Nama Event Harus diisi", type: "error" });
            return;
        }
        if (!formData.date.trim()) {
            onSubmit({ message: "Tanggal Harus diisi", type: "error" });
            return;
        }
        onSubmit(formData);
        setFormData({ nama_event: "", date: "" });
        setShow(false);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShow(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-xl shadow-lg w-96"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <h2 className="text-white text-lg font-bold mb-4 text-center">
                            Tambah Event
                        </h2>

                        <label className="text-white block mb-1">Nama Event</label>
                        <input
                            type="text"
                            value={formData.nama_event}
                            onChange={(e) =>
                                setFormData({ ...formData, nama_event: e.target.value })
                            }
                            className="w-full mb-4 px-3 py-2 rounded-lg outline-none bg-white text-black"
                        />

                        <label className="text-white block mb-1">Tanggal Mulai</label>
                        <input
                            type="datetime-local"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({ ...formData, date: e.target.value })
                            }
                            onClick={(e) => e.target.showPicker()}
                            className="w-full mb-6 px-3 py-2 rounded-lg outline-none bg-white text-black cursor-pointer "
                        />

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-white text-orange-600 font-semibold px-4 py-1 rounded-lg cursor-pointer"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShow(false)}
                                className="bg-red-600 text-white font-semibold px-4 py-1 rounded-lg cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
