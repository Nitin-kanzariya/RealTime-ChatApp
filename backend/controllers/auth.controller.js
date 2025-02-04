import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  // Validate input fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  try {
    // Check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });
    if (newUser) {
      //generate token
      const token = generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log("Error in register controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate token
    const token = generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// export const updateProfile = async (req, res) => {
//   // console.log(req.files);
//   // console.log(req.body);

//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json({ message: "No files were uploaded." });
//   }
//   const { profilePic } = req.files;
//   // Validate input fields
//   if (!profilePic) {
//     return res.status(400).json({ message: "Please select Profile Pic" });
//   }
//   const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
//   if (!allowedFormats.includes(profilePic.mimetype)) {
//     return res.status(400).json({ message: "Invalid file format" });
//   }

//   try {
//     const userId = req.user._id;

//     const cloudinaryResponse = await cloudinary.uploader.upload(
//       profilePic.tempFilePath
//     );

//     if (!cloudinaryResponse || cloudinaryResponse.error) {
//       console.error(
//         "Cloudinary Error:",
//         cloudinaryResponse.error || "Unknown Cloudinary error"
//       );
//       return res.status(500).json({ message: "Internal server Error" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         profilePic: cloudinaryResponse.secure_url,
//       },
//       { new: true }
//     );

//     res
//       .status(200)
//       .json({ message: "Profile Pic updated successfully", updatedUser });
//   } catch (error) {
//     console.log("Error in updateProfile controller:", error.message);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  // Validate input fields
  if (!email) {
    return res.status(400).json({ message: "Please enter email" });
  }
  try {
    const checkuser = await User.findOne({ email });
    if (!checkuser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // Generate a JWT token for password reset
    const resetToken = jwt.sign(
      { userId: checkuser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30m" } // Token expires in 30 minutes
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "nitinkanzariya112233@gmail.com",
        pass: "sptikgksgcuaamom",
      },
    });

    const BASE_URL =
      process.env.DEPLOYMENT_STAGE === "production"
        ? "https://realtime-chatapp-rtvo.onrender.com"
        : "http://localhost:5173";

    const receiver = {
      from: "realtime.chatapp@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Click on the link to reset your password: ${BASE_URL}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(receiver);

    res.status(200).json({ message: "Reset password Link Send to your mail" });
  } catch (error) {
    console.log("Error in forgetPassword controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("token", token);

  // Validate input fields
  if (!password) {
    return res.status(400).json({ message: "Please enter password" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode || !decode.userId)
      return res.status(400).json({ message: "Invalid Token" });

    const userId = decode.userId;

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: hashPassword,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const email = req.user.email;

  // Validate input fields
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // Validate password
    const isMatch = await bcrypt.compare(currentPassword, checkUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password Not Matched" });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    checkUser.password = hashPassword;
    await checkUser.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error in changePassword controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const addFriend = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { friendId } = req.body;

    const user = await User.findById(loggedInUserId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.log("Error in addFriend controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId).populate("friends");

    const friendDetails = await User.find(
      { _id: { $in: user.friends } },
      { password: 0 } // Exclude password field
    );

    res.status(200).json(friendDetails);
  } catch (error) {
    console.log("Error in getFriends controller:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
