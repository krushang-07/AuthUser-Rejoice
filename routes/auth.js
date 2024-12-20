const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userSchema");
const { OAuth2Client } = require("google-auth-library");
//const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const client = new OAuth2Client(
  "27249279823-kp21grlbck751a0t9c8jnpsi762rmf6g.apps.googleusercontent.com"
);

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, "holaamigo", {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "holaamigo", {
      expiresIn: "1h",
    });
    res.status(200).json({ token, message: "Login successFully" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/google-signup", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "27249279823-kp21grlbck751a0t9c8jnpsi762rmf6g.apps.googleusercontent.com",
    });
    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, googleId: ticket.getUserId() });
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, "holaamigo", {
      expiresIn: "1h",
    });
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Google Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "27249279823-kp21grlbck751a0t9c8jnpsi762rmf6g.apps.googleusercontent.com",
    });
    const { email } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const jwtToken = jwt.sign({ id: user._id }, "holaamigo", {
      expiresIn: "1h",
    });
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  // const { email } = req.body;
  // try {
  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     return res.status(400).json({ message: "User not found" });
  //   }
  //   const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY_JWT, {
  //     expiresIn: "1h",
  //   });
  //   const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  //   await transporter.sendMail({
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     subject: "Password Reset",
  //     text: `Click the following link to reset your password: ${resetLink}`,
  //   });
  //   res.status(200).json({ message: "Password reset link sent to your email" });
  // } catch (error) {
  //   console.error("Forgot Password Error:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
});

module.exports = router;
