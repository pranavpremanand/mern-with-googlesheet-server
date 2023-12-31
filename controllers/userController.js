import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  loginValidations,
  signupValidations,
} from "../middlewares/validations.js";
import { userModel } from "../models/userModel.js";

// signup
export const doSignup = async (req, res) => {
  try {
    signupValidations(req, res);
    let { email, password } = req.body;
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      res.status(200).json({ success: false, message: "Email already exists" });
    } else {
      password = await bcrypt.hash(password, 10);
      const newUser = userModel({ ...req.body, password });
      newUser.save().then((data) => {
        const accessToken = jwt.sign(
          { id: data._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
        res.status(201).json({
          success: true,
          message: "User created successfully",
          data,
          accessToken,
        });
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// login
export const doLogin = async (req, res) => {
  try {
    loginValidations(req, res);
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(200).json({
        error: "Invalid credentials",
        message: "Email doesn't exists",
      });
    } else {
      bcrypt.compare(password, user.password).then((response) => {
        if (response) {
          const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
          );
          res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
            accessToken,
          });
        } else {
          res.status(200).json({
            success: false,
            message: "Incorrect password",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// get user data
export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findOne({_id:req.userId});
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json(err);
  }
};

// get users list
export const getUsersList = async (req, res) => {
  try {
    const users = await userModel.find({ isAdmin: false });
    res.status(200).json({
      success: true,
      data: users,
      message: "Data fetched successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// block or unblock user
export const changeUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    await userModel.updateOne({ _id: userId }, { isBlocked: status });
    res.status(200).json({ success: true, message: "Updated user status" });
  } catch (err) {
    res.status(500).json(err);
  }
};
