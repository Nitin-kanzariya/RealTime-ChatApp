import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    //find all users except the logged in user
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
  

export const getMessages = async (req, res) => {
  try {
    const { id: chatPartnerId } = req.params; // The user you're chatting with
    const currentUserId = req.user._id; // The ID of the currently authenticated user

    const chatMessages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: currentUserId },
      ],
    });

    res.status(200).json(chatMessages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl = "";
    if (image) {
      //Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
