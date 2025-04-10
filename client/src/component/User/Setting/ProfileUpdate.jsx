import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../Reusables/PasswordInput";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  uploadProfilePhoto,
} from "../../../redux/reducers/userSlice";

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState(""); // ✅ Fix: Added missing state
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    interests: [],
    photo: "",
    password: "",
    oldPassword: "",
    confirmNewPassword: "",
    socialMediaLinks: {
      facebook: "",
      x: "",
      instagram: "",
      linkedin: "",
      telegram: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "", // ✅ Fix: Changed userData to user
        location: user.location || "",
        photo: user.photo || "",
        interests: user.interests || [],
        socialMediaLinks: user.socialMediaLinks || {
          facebook: "",
          x: "",
          instagram: "",
          linkedin: "",
          telegram: "",
        },
      });
      setProfilePhoto(user.photo || ""); // ✅ Set profile image
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialMediaLinks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMediaLinks: {
          ...prev.socialMediaLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setIsFormChanged(true); // ✅ Enable update button when input changes
  };

  const handlePastePassword = (e) => {
    e.preventDefault();
    toast.error("Cannot paste into this field");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUser(formData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        navigate("/settings"); // ✅ Redirect after update
      })
      .catch((err) => {
        toast.error(err || "Update failed");
      });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, photo: file }));
      setIsPhotoChanged(true);
      e.target.value = ""; // ✅ Clears file input for re-uploading same image
    }
  };
  console.log('Form data: ',formData.photo)

  const handlePhotoUpload = async () => {
    if (!isPhotoChanged) return;
  
    dispatch(uploadProfilePhoto(formData.photo))
      .unwrap()
      .then((imageUrl) => {
        setProfilePhoto(imageUrl.photo); // ✅ Update the state immediately
        setFormData((prev) => ({ ...prev, photo: imageUrl.photo }));
        setIsPhotoChanged(false);
        toast.success("Profile picture updated successfully!");
        navigate('/settings')
      })
      .catch((error) => {
        toast.error(error || "Failed to upload photo. Please try again.");
      });
  };  

  const isUpdateDisabled = (!isFormChanged && !isPhotoChanged) || loading;

  return (
    <div className="flex justify-center items-center bg-orange-100 py-28 font-inter">
      <div className="relative flex flex-col gap-5 py-6 px-1 rounded-xl shadow-lg bg-orange-300 bg-opacity-50">
        <div className="flex justify-between items-center gap-6 border-b border-gray-600 px-4 py-2">
          <Link to="/settings">
            <FaArrowLeft size={20} />
          </Link>
          <div className="flex flex-col gap-0">
            <p className="font-semibold text-xl">Edit Profile</p>
            <p className="font-normal text-sm">
              Make your information stand out by keeping it up to date.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5 px-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <div className="w-[50px] h-[50px] overflow-hidden rounded-full bg-white">
                <img
                  src={formData?.photo?.imageUrl || profilePhoto || "user image"}
                  alt={`${formData.name}'s image`}
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                hidden
                id="photoUpload"
              />
              <label
                htmlFor="photoUpload"
                className="flex items-center gap-1 cursor-pointer"
              >
                <MdAdd />
                <p>Add image</p>
              </label>
            </div>
            <div className="flex items-center justify-center w-full">
              <button
                type="button"
                onClick={handlePhotoUpload}
                className={`py-3 px-14 text-white rounded-md text-sm max-w-[200px] bg-slate-500 hover:bg-slate-600`}
                disabled={isUpdateDisabled}
              >
                Update
                {/* {isUpdateDisabled ? "Updating image..." : "Update"} */}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-medium pl-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="location" className="font-medium pl-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                onChange={handleInputChange}
                value={formData.location}
                className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="oldPassword" className="font-medium pl-1">
                Old Password
              </label>
              <input
                placeholder="old password"
                type="password"
                id="oldPassword"
                name="oldPassword"
                onChange={handleInputChange}
                value={formData.oldPassword}
                className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium pl-1">
                New Password
              </label>
              <PasswordInput
                placeholder="New Password"
                id="password"
                name="password"
                className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmNewPassword" className="font-medium pl-1">
                Confirm New Password
              </label>
              <PasswordInput
                placeholder="Confirm New password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300 w-full"
                onPaste={handlePastePassword}
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col gap-0">
                <p className="font-medium text-xl">Social Handles</p>
                <p className="font-normal text-sm">
                  Add the url of your social handles to attach your accounts
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="url"
                  id="facebook"
                  name="socialMediaLinks.facebook"
                  placeholder="Enter Facebook URL"
                  onChange={handleInputChange}
                  value={formData.socialMediaLinks.facebook}
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
                />

                <input
                  type="url"
                  id="x"
                  name="socialMediaLinks.x"
                  placeholder="Enter X URL"
                  onChange={handleInputChange}
                  value={formData.socialMediaLinks.x}
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
                />

                <input
                  type="url"
                  id="instagram"
                  name="socialMediaLinks.instagram"
                  placeholder="Enter Instagram URL"
                  onChange={handleInputChange}
                  value={formData.socialMediaLinks.instagram}
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
                />

                <input
                  type="url"
                  id="linkedin"
                  name="socialMediaLinks.linkedin"
                  placeholder="Enter LinkedIn URL"
                  onChange={handleInputChange}
                  value={formData.socialMediaLinks.linkedin}
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
                />

                <input
                  type="url"
                  id="telegram"
                  name="socialMediaLinks.telegram"
                  placeholder="Enter Telegram URL"
                  onChange={handleInputChange}
                  value={formData.socialMediaLinks.telegram}
                  className="bg-orange-50 p-2 rounded-lg border-b-2 border-orange-400 focus:outline-none focus:border-orange-300 w-full"
                />
              </div>
            </div>

            <p className="text-red-500">{error}</p>

            <div className="flex items-center justify-center w-full">
              <button
                type="submit"
                className={`py-3 px-14 text-white rounded-md text-sm max-w-[200px] ${
                  isFormChanged
                    ? "bg-slate-500"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
                disabled={!isFormChanged || loading}
              >
                {loading ? "Updating Profile..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
