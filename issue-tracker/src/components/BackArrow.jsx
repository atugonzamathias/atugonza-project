import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // or use an SVG/icon of your choice

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 flex items-center text-blue-700 hover:text-blue-900 transition duration-200"
    >
      <ArrowLeft className="mr-2 h-5 w-5" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackArrow;