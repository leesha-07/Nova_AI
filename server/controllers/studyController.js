const Study = require("../models/Study");
const { GoogleGenAI } = require("@google/genai");

const genai = new GoogleGenAI({
  apiKey: process.env.Study_GEMINI_API_KEY,
});
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
  const {
    title,
    startDate,
    subject,
    endDate,
    dailyHours,
    goal,
    completedHours,
    progress,
  } = req.body;
  const study = await Study.findById(studyId);
  if (!study) {
    return res.status(404).json({ message: "Study Plan not found" });
  }
  study.title = title;
  study.startDate = startDate;
  study.subject = subject;
  study.endDate = endDate;
  study.dailyHours = dailyHours;
  study.completedHours = completedHours;
  study.progress = progress;
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
const generateStudyPlan = async (req, res) => {
  try {
    const { subject, goal, dailyHours, startDate, endDate } = req.body;

    if (!subject || !goal || !dailyHours) {
      return res.status(400).json({
        message: "Subject, goal and daily hours are required",
      });
    }

    const response = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `Create a simple study plan.

Subject: ${subject}
Goal: ${goal}
Daily study hours: ${dailyHours}
Start date: ${startDate || "Not specified"}
End date: ${endDate || "Not specified"}

Give a practical day-by-day study plan.
Keep it clear and concise.
Do not use Markdown.`,
    });

    res.status(200).json({
      message: "Study plan generated successfully",
      plan: response.output_text,
    });
  } catch (error) {
    console.error("Study plan generation error:", error);

    res.status(500).json({
      message: "Failed to generate study plan",
      error: error.message,
    });
  }
};
module.exports = {
  createStudy,
  getStudys,
  getStudy,
  updateStudy,
  deleteStudy,
  generateStudyPlan,
};
