import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// register
export const userCreate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ msg: "User Already registered" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{3,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    await User.create({
      email: email,
      password: hashpassword,
    });

    res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Unauthorized user" });
    }

    const AuthToken = jwt.sign(
      {
        userId: user?._id,
        userEmail: user?.email,
      },
      process.env.AUTH_SECRET_CODE,
      { expiresIn: "15m" },
    );

    const RefreshToken = jwt.sign(
      {
        userId: user?._id,
        userEmail: user?.email,
      },
      process.env.REFRESH_SECRET_CODE,
      { expiresIn: "7D" },
    );

    res.cookie("authToken", AuthToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60 * 1000, 
    });

    res.cookie("refreshToken",RefreshToken ,
      {
     httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 1000,
      }
    )

    res.status(200).json({msg : "Login Success"})
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const verify = jwt.verify(refreshToken, process.env.REFRESH_SECRET_CODE);

    const newAuthToken = jwt.sign(
      {
        userId: verify.userId,
        email: verify.email,
      },
      process.env.AUTH_SECRET_CODE,
      { expiresIn: "15m" },
    );

    res.cookie("authToken", newAuthToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(403);
  }
};

// Me
export const Me = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      user: {
        isLogin: true,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err?.message || "Server Error" });
  }
};

// Log Out
export const Logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      msg: "Logged out successfully",
      isLogout: true,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// forgot password
export const forgotPassword = async (req,res) => {
  try {
    const { email } = await req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({msg : "User not found"})
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = new Date(Date.now() + 1000 * 60 * 15);
    await user.save();

    const resetLink = `${ process.env.NODE_ENV === "development"
    ? process.env.LOCAL_BASE_URL
    : process.env.PUBLIC_BASE_URL}/Client/Auth/ResetPassword/${token}`;

    await sendMail(
      email,
      "Reset Password",
      `<p>Click here to reset: <a href="${resetLink}">Reset</a></p>`,
    );

    return res.status(200).json({      
      success: true,
      msg: "Reset Password Send to your Email"
    })
  } catch (err) {
    res.status(500).json({msg : err?.message || "Something went wrong"})
  }
};

// reset password
export const resetPassword = async (req,res) => {
  try {
    const { token, password } = await req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({msg : "User not found"})
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    user.password = hasedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    return res.status(200).json({      
      success: true,
      msg: "Password Reserted Successfully"
    })
  } catch (err) {
    res.status(500).json({msg : err?.message || "something went wrong"})
  }
};