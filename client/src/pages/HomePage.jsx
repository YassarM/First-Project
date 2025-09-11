import React, { useEffect, useState } from "react";
import axios from "axios";
import { Circle } from "lucide-react";
import logo from "../assets/half_logo.png"
export default function Admin() {
  const API_BASE_URL = "http://localhost:3000";
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // sementara buat 1 slide real + 2 dummy
    const dummySlides = [
      { id: 1, text: "Selamat datang di Event Besar Tahun Ini!" },
      { id: 2, text: "System Penilaian Digital Lomba LKBB" },
      { id: 3, text: "Slide Dummy Ketiga - Pantau terus!" }
    ];
    setSlides(dummySlides);

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/all-events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Gagal fetch events:", err);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-black min-h-screen text-white   flex">
      {/* === Kiri: Logo + Slide === */}
      {/* Logo burung merah-orange */}

      <div className="absolute items-center ml-0 mb-5 mt-10 z-10 ">
        <img
          src={logo}
          alt="Logo"
          className="w-85 object-cover items-end"
        />
      </div>
      <div className="flex-1 p-5">
        {/* Slide Section */}
        <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-xl h-128 ml-5 flex flex-col items-center justify-center">
          <div className="flex ">
            <p className="text-4xl font-semibold px-4 text-center justify-item-end">
              {slides[currentSlide]?.text}
            </p>
          </div>
          {/* Dots indikator */}
          <div className="absolute bottom-3 flex space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? "bg-white" : "bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* === Kanan: Daftar Event === */}
      <div className="w-64 ml-6">
        <h2 className="text-lg font-bold mb-3">Semua Event</h2>
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id_event}
              className="bg-gradient-to-br to-orange-500 from-red-500 p-3 rounded-lg flex flex-col"
            >
              <span className="font-semibold">{ev.nama_event}</span>
              <span className="text-sm text-gray-400">{ev.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
