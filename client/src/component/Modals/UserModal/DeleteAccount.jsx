import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteUser } from "../../../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

const DeleteAccount = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteUser());
    toast.success('User deleted successfully')
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 font-inter">
      <div className="flex flex-col items-center gap-8 px-8 py-16 rounded-lg shadow-lg relative w-1/3 bg-orange-300 text-center">
        <p className="font-semibold text-xl">
          Are you sure you want to delete your account?
        </p>
        <div className="flex gap-4">
          <button
            className="bg-slate-500 py-2 px-6 sm:px-10 text-base text-white rounded-md hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[200px]"
            onClick={handleDelete}
          >
            Yes
          </button>
          <button
            className="bg-slate-500 py-2 px-6 sm:px-10 text-base text-white rounded-md hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[200px]"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
