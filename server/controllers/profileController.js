const Profile = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await Profile.findById(userId).select(
      "-password -resetToken -resetTokenExpiry",
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile was not found",
      });
    }

    res.status(200).json({
      message: "Found Profile",
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, email, bio, profileImage, location } = req.body;

    const profile = await Profile.findById(userId);

    if (!profile) {
      return res.status(404).json({
        message: "Profile was not found",
      });
    }

    if (name !== undefined) {
      profile.name = name;
    }

    if (email !== undefined) {
      profile.email = email;
    }

    if (bio !== undefined) {
      profile.bio = bio;
    }

    if (profileImage !== undefined) {
      profile.profileImage = profileImage;
    }

    if (location !== undefined) {
      profile.location = location;
    }

    await profile.save();

    const safeProfile = await Profile.findById(userId).select(
      "-password -resetToken -resetTokenExpiry",
    );

    res.status(200).json({
      message: "Profile was updated successfully",
      profile: safeProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
