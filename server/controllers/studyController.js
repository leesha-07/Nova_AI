const Study = require("../models/Study");
const createStudy = async (req, res) => {
  const {
    userId,
    title,
    startDate,
    subject,
    endDate,
    dailyHours,
    goal,
    status,
  } = req.body;
  const study = await Study.create({
    userId,
    title,
    startDate,
    subject,
    endDate,
    dailyHours,
    goal,
    status,
  });
  res.status(201).json({ message: "Study Plan created successfully", study });
};
const getStudys = async (req, res) => {
  const { userId } = req.params;
  const study = await Study.find({ userId });
  res.status(200).json({ message: "The study Plans found", study });
};
const getStudy = async (req, res) => {
  const { studyId } = req.params;
  const study = await Study.findById(studyId);
  if (!study) {
    return res.status(404).json({ message: "Study Plan not found" });
  }
  res.status(200).json({ message: "Found Study Pan", study });
};
const updateStudy = async (req, res) => {
  const { studyId } = req.params;
  const { title, startDate, subject, endDate, dailyHours, goal } = req.body;
  const study = await Study.findById(studyId);
  if (!study) {
    return res.status(404).json({ message: "Study Plan not found" });
  }
  study.title = title;
  study.startDate = startDate;
  study.subject = subject;
  study.endDate = endDate;
  study.dailyHours = dailyHours;
  study.goal = goal;
  await study.save();
  res.status(200).json({ message: "Study Plan updated successfully", study });
};
const deleteStudy = async (req, res) => {
  const { studyId } = req.params;
  const study = await Study.findById(studyId);
  if (!study) {
    return res.status(404).json({ message: "Study Plan not found" });
  }
  await study.deleteOne();
  res.status(200).json({ message: "Study Plan was deleted successfully" });
};
module.exports = { createStudy, getStudys, getStudy, updateStudy, deleteStudy };
