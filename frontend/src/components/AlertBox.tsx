import { useEffect } from "react";

type AlertBoxProps = {
  message: string;
  onClose: () => void;
};

const AlertBox = ({ message, onClose }: AlertBoxProps) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000); // dispare după 3 secunde
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-fade-in">
      {message}
    </div>
  );
};

export default AlertBox;
