import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

      profileImage: {
      url : {
        type : String
      },
      public_id : {
        type : String
      }
    },

    firstName: {
      type: String,
    },

    lastName : {
      type : String,
    },

email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [
    /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{3,}$/,
    "Invalid email format"
    ],
  },

    phone: {
      type: String,
    },
    gender : {
      type : String,
    },
    age : {
      type : String,
    },
    location : {
      type : String,
    },
    state : {
      type : String,
    },
    country : {
      type : String,
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model('UserProfile',userProfileSchema,'UserProfile')

export default UserProfile