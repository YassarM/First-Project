import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({ message, onConfirm , handleNo}) {

  return (
    <>
      {/* Trigger Button */}


      {/* Popup with animation */}
      <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {message || "Yakin ingin melanjutkan?"}
              </h2>
              <div className="flex justify-around">
                <button
                  onClick={onConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition cursor-pointer"
                >
                  Ya
                </button>
                <button
                  onClick={handleNo}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:scale-105 transition cursor-pointer"
                >
                  Tidak
                </button>
              </div>
            </motion.div>
          </motion.div>
      </AnimatePresence>
    </>
  );
}
