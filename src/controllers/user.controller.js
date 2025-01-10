import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFullName,
} from "../utils/validation.js";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and RefreshTokens"
    );
  }
};
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
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }
  const avaterLocalPath = req?.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;
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
    password: password,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || "",
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while saving Data in Database"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
const loginUser = asynchandler(async (req, res, next) => {
  const { email, password, username } = req.body;
  console.log(req.body);
  if (!validateEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  if (!validatePassword(password)) {
    throw new ApiError(400, "Please provide a valid password");
  }
  if (!validateUsername(username)) {
    throw new ApiError(400, "Please provide a valid username");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const matchedPassword = user.isPasswordCorrect(password);
  if (!matchedPassword) {
    throw new ApiError(401, "Invalid Password");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});
const logoutUser = asynchandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
const refreshAccessToken = asynchandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken: newrefreshToken } =
      await generateAccessandRefreshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newrefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});
const changeuserPassword = asynchandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!validatePassword(oldPassword) || !validatePassword(newPassword)) {
    throw new ApiError(400, "Please provide a valid password");
  }
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(
      400,
      "New Password and confirm New Password does not match"
    );
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const matchedPassword = await user.isPasswordCorrect(oldPassword);
  if (!matchedPassword) {
    throw new ApiError(401, "Invalid Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const currentUser = asynchandler(async (req, res, next) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully"));
});
const updateUserDetails = asynchandler(async (req, res, next) => {
  const user = req.user;
  const { fullName, username, email } = req.body;
  if ([fullName, username, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please provide all the required fields");
  }
  if (!validateUsername(username)) {
    throw new ApiError(400, "Please provide a valid username");
  }
  if (!validateFullName(fullName)) {
    throw new ApiError(400, "Please provide a valid full name");
  }
  if (!validateEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  user.fullName = fullName;
  user.username = username;
  user.email = email;
  await user.save({ validateBeforeSave: false });
  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User Details Updated Successfully")
    );
});
const updateUserAvatar = asynchandler(async (req, res, next) => {
  const user = req.user;
  const avatarLocalPath = req?.file?.avatar.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Please provide an avatar image");
  }
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUrl) {
    throw new ApiError(500, "Error while uploading avatar image");
  }
  updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        avatar: avatarUrl.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User Avatar Updated Successfully")
    );
});
const updateUserCoverImage = asynchandler(async (req, res, next) => {
  const user = req.user;
  const CoverImageLocalPath = req?.file?.coverImage.path;
  if (!CoverImageLocalPath) {
    throw new ApiError(400, "Please provide an Cover image");
  }
  const coverImageUrl = await uploadOnCloudinary(CoverImageLocalPath);
  if (!coverImageUrl) {
    throw new ApiError(500, "Error while uploading coverImage image");
  }
  updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        coverImage: coverImageUrl.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User CoverImage Updated Successfully")
    );
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeuserPassword,
  currentUser,
  updateUserDetails,
  updateUserAvatar,
};
