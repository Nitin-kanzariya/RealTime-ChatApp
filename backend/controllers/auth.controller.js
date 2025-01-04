import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

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
