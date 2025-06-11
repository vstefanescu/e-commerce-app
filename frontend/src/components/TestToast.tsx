import { toast } from "react-hot-toast";

const TestToast = () => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => toast.success("Toast-ul merge! 🎉")}
    >
      Testează toast
    </button>
  );
};

export default TestToast;
