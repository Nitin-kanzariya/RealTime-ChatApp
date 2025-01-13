import React from "react";
import { X, Download } from "lucide-react";

function ImageViewer({ imageUrl, onClose }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${Date.now()}.${blob.type.split("/")[1]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-red-500  bg-black/60 p-2 rounded-full shadow-lg transition-colors "
        >
          <X size={24} />
        </button>
        <div className="relative">
          <img
            src={imageUrl}
            alt="Full size"
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 bg-white/60 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageViewer;
