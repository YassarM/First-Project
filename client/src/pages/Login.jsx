import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../AuthContext";
import { namaEvents, tryLogin } from "../api";
import logo from "../assets/logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showBox, setShowBox] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);

    setTimeout(() => setShowBox(true), 200);
    setTimeout(() => setShowForm(true), 1200);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const data = await tryLogin(username, password);
      if (data.data.LoggedIn) {
        const event = await namaEvents(data.data.data.id_user);
        login(data.data.data);

        switch (data.data.data.role) {
          case "Admin":
            navigate("/adminPage");
            break;
          case "Panitia":
            navigate("/" + event.data.nama_event + "/panitiaPage");
            break;
          case "Juri":
            navigate("/" + event.data.nama_event + "/juri-page");
            break;
          case "Pelatih":
            navigate("/" + event.data.nama_event + "/pelatih-page");
            break;
          case "Asjur":
            navigate("/" + event.data.nama_event + "/juri-page");
            break;
          default:
            navigate("/");
        }
      } else {
        setErrorMessage(data.error || "Login failed");
      }
    } catch (err) {
      
      if (err.response && err.response.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Server error, please try again later.");
      }
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row relative">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 z-50 cursor-pointer"
      >
        <ArrowLeft size={28} />
      </button>

      {/* LEFT (Logo area) */}
      <div className="flex flex-1 justify-center items-start md:items-center bg-black p-6 pt-16 md:pt-0">
        <img src={logo} alt="POINIX Logo" className="w-64 md:w-[28rem]" />
      </div>

      {/* RIGHT (Login box with animation) */}
      <motion.div
        initial={isDesktop ? { x: "100%" } : { y: "100%" }}
        animate={showBox ? { x: 0, y: 0 } : isDesktop ? { x: "100%" } : { y: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex flex-1 justify-center items-center 
                   bg-gradient-to-br from-orange-500 to-orange-600 
                   md:rounded-l-4xl md:static fixed bottom-0 w-full md:w-auto 
                   rounded-t-3xl md:rounded-t-none h-[65%] md:h-auto"
      >
        <form onSubmit={handleLogin} className="bg-transparent p-6 w-full max-w-md">
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showForm ? 1 : 0, y: showForm ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <label
              htmlFor="username"
              className="block font-bold text-white mb-2 text-xl"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-6 py-4
               text-xl border rounded-lg focus:outline-none focus:ring-orange-300 focus:ring-2 bg-orange-500 focus:bg-orange-500 text-white placeholder-white"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showForm ? 1 : 0, y: showForm ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <label
              htmlFor="password"
              className="block font-bold text-white mb-2 text-xl"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-6 py-4
               text-xl border rounded-lg focus:outline-none focus:ring-orange-300 focus:ring-2 bg-orange-500 focus:bg-orange-500 text-white placeholder-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </motion.div>
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-200 bg-red-700/40 rounded-lg px-4 py-2 mb-4 text-center"
            >
              {errorMessage === "Invalid username"
                ? "❌ Username tidak ditemukan"
                : errorMessage === "Invalid password"
                  ? "❌ Password salah"
                  : errorMessage}
            </motion.p>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: showForm ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full bg-orange-700 hover:bg-orange-800 text-white py-4 text-xl rounded-lg font-semibold shadow-md"
          >
            Log In
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}

export default Login;
