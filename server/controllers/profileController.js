const Profile = require("../models/User");
const getProfile = async (req, res) => {
  const { userId } = req.params;
  const profile = await Profile.findById(userId).select("-password");
  res.status(200).json({ message: "Found Profile", profile });
};
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email, bio, profileImage, location } = req.body;
  const profile = await Profile.findById(userId);
  if (!profile) {
    return res.status(404).json({ message: "Profile was not found" });
  }
  profile.name = name;
  profile.email = email;
  profile.bio = bio;
  profile.profileImage = profileImage;
  profile.location = location;
  await profile.save();
  res
    .status(200)
    .json({ message: "Profile was updated successfully", profile });
};
module.exports = { getProfile, updateProfile };
