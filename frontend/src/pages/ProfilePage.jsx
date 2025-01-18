// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Camera, Mail, User } from "lucide-react";

// const ProfilePage = () => {
//   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
//   const [selectedImg, setSelectedImg] = useState(null);

//   // const handleImageUpload = async (e) => {
//   //   const file = e.target.files[0];
//   //   if (!file) return;

//   //   const formData = new FormData();
//   //   formData.append("profilePic", file);

//   //   await updateProfile(formData);
//   // };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Image = reader.result;
//       // console.log("base64Image",base64Image);

//       setSelectedImg(base64Image);
//       await updateProfile({ profilePic: base64Image });
//     };
//   };

//   return (
//     <div className="pt-20 ">
//       <div className="max-w-2xl mx-auto p-4 py-8 ">
//         <div className="bg-base-200  rounded-xl p-6 space-y-8 ">
//           <div className="text-center">
//             <h1 className="text-2xl font-semibold ">Profile</h1>
//             <p className="mt-2">Your profile information</p>
//           </div>

//           {/* avatar upload section */}

//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <img
//                 src={selectedImg || authUser.profilePic || "/avatar.png"}
//                 alt="Profile"
//                 className="size-32 rounded-full object-cover border-4 "
//               />
//               <label
//                 htmlFor="avatar-upload"
//                 className={`
//                   absolute bottom-0 right-0
//                   bg-base-content hover:scale-105
//                   p-2 rounded-full cursor-pointer
//                   transition-all duration-200
//                   ${
//                     isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
//                   }
//                 `}
//               >
//                 <Camera className="w-5 h-5 text-base-200" />
//                 <input
//                   type="file"
//                   id="avatar-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={isUpdatingProfile}
//                 />
//               </label>
//             </div>
//             <p className="text-sm text-zinc-400">
//               {isUpdatingProfile
//                 ? "Uploading..."
//                 : "Click the camera icon to update your photo"}
//             </p>
//           </div>

//           <div className="space-y-6">
//             <div className="space-y-1.5">
//               <div className="text-sm text-zinc-400 flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Full Name
//               </div>
//               <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
//                 {authUser?.fullName}
//               </p>
//             </div>

//             <div className="space-y-1.5">
//               <div className="text-sm text-zinc-400 flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email Address
//               </div>
//               <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
//                 {authUser?.email}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6 bg-base-300 rounded-xl p-6">
//             <h2 className="text-lg font-medium  mb-4">Account Information</h2>
//             <div className="space-y-3 text-sm">
//               <div className="flex items-center justify-between py-2 border-b border-zinc-700">
//                 <span>Member Since</span>
//                 <span>{authUser.createdAt?.split("T")[0]}</span>
//               </div>
//               <div className="flex items-center justify-between py-2">
//                 <span>Account Status</span>
//                 <span className="text-green-500">Active</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProfilePage;




import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      const imageData = {
        type: "PROFILE_PICTURE",
        profilePic: base64Image,
      };

      await updateProfile(imageData);

      setSelectedImg(null);
    };
  };

  const validatePasswordForm = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Confirm passwords don't match");
      return false;
    }
    return true;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);

    try {
      const passwordData = {
        type: "PASSWORD",
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };

      await updateProfile(passwordData);

      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-200 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Security Settings</h2>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-4 py-2 text-sm bg-base-content text-base-200 rounded-lg hover:opacity-90 transition-opacity"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-zinc-400">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-2 bg-base-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-base-content/20"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-zinc-400">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-2 bg-base-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-base-content/20"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-zinc-400">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-base-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-base-content/20"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-base-content text-base-200 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword
                    ? "Updating Password..."
                    : "Update Password"}
                </button>
              </form>
            )}
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
