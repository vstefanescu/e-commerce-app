import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = {
  id: number;
  message: string;
};

type ToastListProps = {
  toasts: Toast[];
  removeToast: (id: number) => void;
};

const ToastList = ({ toasts, removeToast }: ToastListProps) => {
  useEffect(() => {
    // Auto-dismiss la 3 secunde
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 max-w-sm">
      <AnimatePresence>
        {toasts.slice(0, 5).map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35 }}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg cursor-pointer text-sm sm:text-base"
            onClick={() => removeToast(toast.id)}
            title="Click pentru a închide"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastList;