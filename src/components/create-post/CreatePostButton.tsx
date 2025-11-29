
import React from "react";

interface CreatePostButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPosting: boolean;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({
  onClick,
  disabled,
  isPosting
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 rounded-md font-semibold transition-colors ${
        !disabled
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
    >
      {isPosting ? "Posting..." : "Post"}
    </button>
  );
};

export default CreatePostButton;
