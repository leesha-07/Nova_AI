const Voice = require("../models/Voice");
const createVoice = async (req, res) => {
  const { userId, command, response } = req.body;
  const voice = await Voice.create({ userId, command, response });
  res
    .status(200)
    .json({ message: "Voice document created successfully", voice });
};
const getVoices = async (req, res) => {
  const { userId } = req.params;
  const voice = await Voice.find({ userId });
  res.status(200).json({ message: "Found the voice document", voice });
};
const getVoice = async (req, res) => {
  const { voiceId } = req.params;
  const voice = await Voice.findById(voiceId);
  if (!voice) {
    return res.status(404).json({ message: "Voice document not found" });
  }
  res.status(200).json({ message: "Found Voice Document", voice });
};
const deleteVoice = async (req, res) => {
  const { voiceId } = req.params;
  const voice = await Voice.findById(voiceId);
  if (!voice) {
    return res.status(404).json({ message: "Voice document not found" });
  }
  await voice.deleteOne();
  res.status(200).json({ message: "Voice document was deleted successfully" });
};
module.exports = { createVoice, getVoices, getVoice, deleteVoice };
