import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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