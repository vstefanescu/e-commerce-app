import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type ImageDropzoneProps = {
  onFileAccepted: (file: File) => void;
};

const ImageDropzone = ({ onFileAccepted }: ImageDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
        isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-indigo-700">Lasă fișierul aici...</p>
      ) : (
        <p className="text-gray-600">
          Trage o imagine aici sau apasă pentru a selecta una
        </p>
      )}
    </div>
  );
};

export default ImageDropzone;
