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
import Loader from "../../Spinners/Loader";

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector((state) => state.user);

  console.log({ loading, user, error });

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

  console.log("user before rendering form:", user);

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

    console.log("Check if handle submit is running");

    // const { confirmNewPassword, ...cleanedFormData } = formData;
    const { confirmNewPassword, oldPassword, password, ...restFormData } = formData;

    const cleanedFormData = { ...restFormData };

    // Only add password fields if user is trying to update password
    if (password && oldPassword && password === confirmNewPassword) {
      cleanedFormData.password = password;
      cleanedFormData.oldPassword = oldPassword;
    } else if (password || oldPassword || confirmNewPassword) {
      toast.error("Please correctly fill all password fields before updating.");
      return;
    }
    // dispatch(updateUser(formData))
    dispatch(updateUser(cleanedFormData))
      .unwrap()
      .then(() => {
        console.log("prfile updated successfully");
        toast.success("Profile updated successfully!");
        navigate("/settings"); // ✅ Redirect after update
      })
      .catch((err) => {
        console.log("updated failed");
        toast.error(err || "Update failed");
      });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setIsFormChanged(true);
      setFormData((prev) => ({ ...prev, photo: file }));
      setIsPhotoChanged(true);
      e.target.value = "";
    }
  };

  const handlePhotoUpload = async () => {
    if (!isPhotoChanged) return;

    dispatch(uploadProfilePhoto(formData.photo))
      .unwrap()
      .then((imageUrl) => {
        setProfilePhoto(imageUrl.photo); // ✅ Update the state immediately
        setFormData((prev) => ({ ...prev, photo: imageUrl.photo }));
        setIsPhotoChanged(false);
        toast.success("Profile picture updated successfully!");
        navigate("/settings");
      })
      .catch((error) => {
        toast.error(error || "Failed to upload photo. Please try again.");
      });
  };

  if (!user) {
    return <Loader loading={true} />;
  }

  if (loading.updateUser) {
    return <Loader loading={loading.updateUser} />;
  }

  if (loading.uploadPhoto) {
    return <Loader loading={loading.uploadPhoto} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-950 py-20 font-inter">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-800 shadow-xl rounded-2xl p-6 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-zinc-700 pb-4">
          <Link to="/settings">
            <FaArrowLeft
              className="text-gray-700 dark:text-zinc-300 hover:text-orange-500"
              size={20}
            />
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-100">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Keep your profile up to date.
            </p>
          </div>
        </div>

        {/* Profile Image Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-700 border dark:border-zinc-600">
              <img
                src={
                  formData?.photo?.imageUrl || profilePhoto || formData?.photo
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                hidden
                id="photoUpload"
              />
              <label
                htmlFor="photoUpload"
                className="flex items-center text-orange-600 hover:text-orange-800 cursor-pointer text-sm font-medium"
              >
                <MdAdd size={18} /> <span className="ml-1">Change Photo</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handlePhotoUpload}
              disabled={!isPhotoChanged || loading.uploadPhoto}
              className={`py-2 px-6 rounded-md text-sm font-semibold text-white transition ${
                !isPhotoChanged || loading.uploadPhoto
                  ? "bg-gray-300 dark:bg-zinc-600 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isPhotoChanged ? "Upload New Photo" : "Update Photo"}
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", id: "name", type: "text", value: formData.name },
            {
              label: "Location",
              id: "location",
              type: "text",
              value: formData.location,
            },
            {
              label: "Old Password",
              id: "oldPassword",
              type: "password",
              value: formData.oldPassword,
            },
          ].map(({ label, id, type, value }) => (
            <div key={id} className="space-y-1">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
              >
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                placeholder={label}
                value={value}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md border border-orange-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          ))}

          {/* Password Inputs */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              New Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading.updateUser}
              className="w-full p-2 rounded-md border border-orange-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
            >
              Confirm New Password
            </label>
            <PasswordInput
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              onPaste={handlePastePassword}
              disabled={loading.updateUser}
              className="w-full p-2 rounded-md border border-orange-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Social Handles */}
          <div className="pt-6 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">
                Social Handles
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Link your social profiles
              </p>
            </div>

            {["facebook", "x", "instagram", "linkedin", "telegram"].map(
              (platform) => (
                <input
                  key={platform}
                  type="url"
                  id={platform}
                  name={`socialMediaLinks.${platform}`}
                  placeholder={`Enter ${
                    platform.charAt(0).toUpperCase() + platform.slice(1)
                  } URL`}
                  value={formData.socialMediaLinks[platform]}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md border border-orange-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              )
            )}
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* <button
            type="submit"
            onClick={() => console.log("Clicked submit button")}
            disabled={!isFormChanged || loading}
            className=""
          >
            Save Changes
          </button> */}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              // onClick={handleSubmit}
              disabled={!isFormChanged || loading.updateUser}
              className={`py-3 px-10 rounded-lg text-white font-medium transition ${
                isFormChanged
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-300 dark:bg-zinc-600 cursor-not-allowed"
              }`}
            >
              {console.log("Loading:", loading)}
              {loading.updateUser ? "Updating Profile..." : "Update Profile"}
              {/* Update */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
