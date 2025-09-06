import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function NotificationStack({ notifications, removeNotif }) {
  return (
    <div
      className={`
  fixed z-50 flex flex-col space-y-3
  w-[90%] md:w-auto
  top-6 right-6
  md:top-1/2 md:left-1/2 md:right-auto
  md:-translate-x-1/2 md:-translate-y-1/2
`}
    >
      <AnimatePresence>
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            {...notif}
            onClose={() => removeNotif(notif.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ id, message, type, onClose }) {
  // auto close tiap notif
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`px-6 py-4 rounded-lg shadow-lg
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
        text-white text-center`}
    >
      {message}
    </motion.div>
  );
}

export default NotificationStack;
