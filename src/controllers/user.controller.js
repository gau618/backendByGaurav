import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFullName,
} from "../utils/validation.js";
const registerUser = asynchandler(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please provide all the required fields");
  }
  if (!validateEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  if (!validatePassword(password)) {
    throw new ApiError(400, "Please provide a valid password");
  }
  if (!validateUsername(username)) {
    throw new ApiError(400, "Please provide a valid username");
  }
  if (!validateFullName(fullname)) {
    throw new ApiError(400, "Please provide a valid full name");
  }
  const existingUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }
  const avaterLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!avaterLocalPath) {
    throw new ApiError(400, "Please provide an avatar image");
  }
  const avatarUrl = await uploadOnCloudinary(avaterLocalPath);
  const coverImageUrl = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Corrected the if condition
  if (!avatarUrl) {
    throw new ApiError(400, "Please provide an avatar image");
  }
  const newUser = await User.create({
    fullName: fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || "",
    refreshToken: "a", // Will update this after generating the token
  });
  const createdUser = newUser
    .findById(newUser._id)
    .select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while saving Data in Database"
    );
  }
  return res.status(201).json(
    new ApiResponse(200,createdUser,'User registered Successfully')
  )
});
export { registerUser };
