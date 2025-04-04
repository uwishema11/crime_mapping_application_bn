import bcrypt from "bcrypt";

import { sendVerificationEmail } from "../helpers/sendEmail";
import sendEmailOnRegistration from "../helpers/emailTemplate";
import { addUser, findUserByEmail, updateVerifiedUser } from "../services/user";
import { userType } from "../types/user";
import {
  generateAccessToken,
  verifyAccessToken,
} from "../helpers/generateToken";
import { successResponse, errorResponse } from "../helpers/response";
import asyncHandler from "../helpers/asyncHandler";

export const registerUser = asyncHandler(async (req, res) => {
  const { password, confirm_password, email } = req.body;

  const isUser = await findUserByEmail(email);
  if (isUser) {
    return errorResponse(
      res,
      "User with the provided email already exists! Please try using different email",
      400
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const body: userType = {
    ...req.body,
    password: hashedPassword,
  };

  const token = await generateAccessToken(body);
  const verificationLink = `${process.env.BASE_URL}/auth/verify/${token}`;
  await sendVerificationEmail(
    body.email,
    sendEmailOnRegistration(req.body.firstName, verificationLink)
  );

  const newUser = await addUser(body);

  newUser.password = "";

  successResponse(
    res,
    newUser,
    201,
    "User registered successfully. Please check your email to verify your account."
  );
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return errorResponse(res, "Invalid link! Please try again", 401);
  }

  const user = verifyAccessToken(token);

  const payload = user.data as userType;
  if (!payload) {
    return errorResponse(
      res,
      "Verification failed. Please try again later or contact the admin",
      401
    );
  }

  if (!user.success) {
    return errorResponse(
      res,
      "Verification failed. Please try again later or contact the admin",
      401
    );
  }

  const email = payload.email;

  const isUserVerified = await findUserByEmail(email);
  if (isUserVerified?.isVerified) {
    return errorResponse(res, "User already verified!", 400);
  }
  await updateVerifiedUser(email);
  successResponse(res, user, 200, "User verified successfully!");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, "Please provide both email and password", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return errorResponse(
      res,
      "User not found! Please register to proceed",
      404
    );
  }
  if (!user.isVerified) {
    return errorResponse(
      res,
      "User not verified! Please verify your account to proceed",
      401
    );
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return errorResponse(
      res,
      "Invalid email or password. Please try again with the correct credentials.",
      401
    );
  }
  const token = await generateAccessToken(user);
  successResponse(res, token, 200, "Logged in successfully");
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "Loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  successResponse(res, null, 200, "Logged out successfully");
});
