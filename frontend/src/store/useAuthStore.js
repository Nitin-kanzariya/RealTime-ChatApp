import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  friends: [],

  addFriend: async (user) => {
    try {
      const friendId = user._id;
      const res = await axiosInstance.post("/auth/add-friend", { friendId });
      toast.success("Friend added successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getFriends: async () => {
    try {
      const res = await axiosInstance.get("/auth/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
      console.log("Error in checkAuth", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
      console.log("Error in signUp", err);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
      console.log("Error in login", err);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  forgetPassword: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/forget-password", data);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  resetPassword: async (data) => {
    try {
      console.log(data);
      const res = await axiosInstance.post(
        `/auth/reset-password/${data.token}`,
        data
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      let endpoint = "/auth/update-profile";

      // Change endpoint based on update type
      if (data.type === "PASSWORD") {
        endpoint = "/auth/change-password";
      }

      const res = await axiosInstance.post(endpoint, data);

      // Only update authUser for profile picture changes
      if (data.type === "PROFILE_PICTURE") {
        set({ authUser: res.data });
      }

      toast.success(
        data.type === "PASSWORD"
          ? "Password updated successfully"
          : "Profile updated successfully"
      );
    } catch (error) {
      console.log(`error in ${data.type.toLowerCase()} update:`, error);
      toast.error(
        error.response.data.message ||
          `Failed to update ${data.type.toLowerCase()}`
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
