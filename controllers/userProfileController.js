import UserProfile from "../models/userProfileModel.js";

// create profile
export const createProfile = async (req, res) => {
  try {
    const { email } = req.body;

    const profiledata = req.body;

    const userId = req.userId;

    console.log(req.userId);

    if (!userId) {
      return res.status(409).json({ msg: "User not logged" });
    }

    const existProfile = await UserProfile.findOne({ userId: req.userId });

    if (existProfile) {
      return res.status(401).json({ msg: "Profile Already Exist" });
    }

    const userProfile = await UserProfile.create({
      userId: req.userId,
      ...profiledata,
    });

    res.status(201).json({ msg: "Profile Created" });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// updateProfile
export const updateProfile = async (req, res) => {
  try {
    const updateObj = {};
    let isValid = false;

    const fields = [
      "profileImage",
      "firstName",
      "lastName",
      "email",
      "phone",
      "gender",
      "age",
      "location",
      "state",
      "country",
    ];

    fields?.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateObj[field] = req.body[field];
        isValid = true;
      }
    });

    const existProfile = await UserProfile.findOne({ userId: req.userId });

    if (!existProfile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    if (!isValid) {
      return res.status(400).json({ msg: "Invalid Field" });
    }

    const update = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: updateObj },
      { new: true },
      { upsert: true },
    );

    res.status(200).json({ msg: "Profile Updated", data: update });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// delete field
export const deleteProfileField = async (req, res) => {
  try {
    const data = req.body;
    const existProfile = await UserProfile.findOne({ userId: req.userId });

    if (!existProfile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const updateddata = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $unset: data },
      { new: true },
    );

    res.status(200).json({ msg: "Field deleted" });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// get profile
export const getProfile = async (req, res) => {
  try {
    const existProfile = await UserProfile.findOne({ userId: req.userId });

    if (!existProfile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const profiledata = await UserProfile.findOne({ userId: req.userId });

    res.status(200).json({ data: profiledata });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};
