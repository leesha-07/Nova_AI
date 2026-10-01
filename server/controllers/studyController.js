const Study = require("../models/Study");
const { GoogleGenAI } = require("@google/genai");

const genai = new GoogleGenAI({
  apiKey: process.env.Study_GEMINI_API_KEY,
});

const createStudy = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { title, startDate, subject, endDate, dailyHours, goal, status } =
      req.body;

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

    res.status(201).json({
      message: "Study Plan created successfully",
      study,
    });
  } catch (error) {
    console.error("Create Study Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const getStudys = async (req, res) => {
  try {
    const userId = req.user.userId;

    const study = await Study.find({ userId });

    res.status(200).json({
      message: "The study Plans found",
      study,
    });
  } catch (error) {
    console.error("Get Studies Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const getStudy = async (req, res) => {
  try {
    const { studyId } = req.params;
    const userId = req.user.userId;

    const study = await Study.findOne({
      _id: studyId,
      userId,
    });

    if (!study) {
      return res.status(404).json({
        message: "Study Plan not found",
      });
    }

    res.status(200).json({
      message: "Found Study Plan",
      study,
    });
  } catch (error) {
    console.error("Get Study Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const updateStudy = async (req, res) => {
  try {
    const { studyId } = req.params;
    const userId = req.user.userId;

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

    const study = await Study.findOne({
      _id: studyId,
      userId,
    });

    if (!study) {
      return res.status(404).json({
        message: "Study Plan not found",
      });
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

    res.status(200).json({
      message: "Study Plan updated successfully",
      study,
    });
  } catch (error) {
    console.error("Update Study Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const deleteStudy = async (req, res) => {
  try {
    const { studyId } = req.params;
    const userId = req.user.userId;

    const study = await Study.findOne({
      _id: studyId,
      userId,
    });

    if (!study) {
      return res.status(404).json({
        message: "Study Plan not found",
      });
    }

    await study.deleteOne();

    res.status(200).json({
      message: "Study Plan was deleted successfully",
    });
  } catch (error) {
    console.error("Delete Study Error:", error);

    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const generateStudyPlan = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { studyId, subject, goal, dailyHours, startDate, endDate } = req.body;

    if (!studyId) {
      return res.status(400).json({
        message: "Study plan selection is required",
      });
    }

    const study = await Study.findOne({
      _id: studyId,
      userId,
    });

    if (!study) {
      return res.status(404).json({
        message: "Study plan not found",
      });
    }

    // If an AI plan was already generated, return the saved plan.
    if (study.aiPlan) {
      return res.status(200).json({
        message: "Saved study plan loaded successfully",
        plan: study.aiPlan,
        saved: true,
      });
    }

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

    const generatedPlan = response.output_text;

    // Save the generated plan to this study plan.
    study.aiPlan = generatedPlan;
    await study.save();

    return res.status(200).json({
      message: "Study plan generated successfully",
      plan: generatedPlan,
      saved: false,
    });
  } catch (error) {
    console.error("Study plan generation error:", error);

    return res.status(500).json({
      message: "Failed to generate study plan",
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
