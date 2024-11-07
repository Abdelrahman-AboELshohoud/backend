const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { username, email, password, role, age, phoneNumber, address } =
    req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let user = await User.create({
      username,
      email,
      password,
      role,
      age,
      phoneNumber,
      address,
      IdImageUrl: req.file.path,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error, "error in register server");
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.cookies);
  if (!email || !password)
    return res.status(401).json({
      message: "Both email and password are required",
    });
  console.log("email", email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(201).json({ message: "Invalid credentials" });
    console.log("user", user);
    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches)
      return res.status(201).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const { password: userPassword, ...userWithoutPassword } = user;
    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword._doc });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server errorr1" });
  }
};

const logout = async (req, res, next) => {
  if (req.logout) {
    req.logout((error) => {
      if (error) {
        console.log(error, "error in logout server");
        return next(error);
      }
    });
  }
  res.clearCookie("auth_token");

  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out" });
};

const validateToken = async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", status: "error" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized", status: "error" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", status: "error" });
    }
    return res.status(200).json({ user, status: "success" });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: "error" });
  }
};
module.exports = { register, login, logout, validateToken };
