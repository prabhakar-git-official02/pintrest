import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{3,}$/,
      "Invalid email format",
    ],
  },

  password: {
    type: String,
    minlength: 6,
  },

  resetPasswordToken : String,
  resetPasswordExpire : Date,
},{timestamps : true});

const User = mongoose.model("User", userSchema, "users");

export default User;
