const { GoogleGenAI } = require("@google/genai");
const Resume = require("../models/Resume");

const genai = new GoogleGenAI({
  apiKey: process.env.Resume_GEMINI_API_KEY,
});

const createResume = async (req, res) => {
  try {
    const {
      userId,
      fileName,
      fileSize,
      fileUrl,
      resumeText,
      overallScore,
      atsScore,
      grammar,
      keywords,
      skills,
      suggestions,
    } = req.body;

    const resume = await Resume.create({
      userId,
      fileName,
      fileSize,
      fileUrl,
      resumeText,
      overallScore,
      atsScore,
      grammar,
      keywords,
      skills,
      suggestions,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId });

    res.status(200).json({
      message: "Resumes found",
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    res.status(500).json({
      message: "Failed to get resumes",
      error: error.message,
    });
  }
};

const getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume found",
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      message: "Failed to get resume",
      error: error.message,
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const {
      fileName,
      fileSize,
      fileUrl,
      resumeText,
      overallScore,
      atsScore,
      grammar,
      keywords,
      skills,
      suggestions,
    } = req.body;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (fileName !== undefined) resume.fileName = fileName;
    if (fileSize !== undefined) resume.fileSize = fileSize;
    if (fileUrl !== undefined) resume.fileUrl = fileUrl;
    if (resumeText !== undefined) resume.resumeText = resumeText;
    if (overallScore !== undefined) resume.overallScore = overallScore;
    if (atsScore !== undefined) resume.atsScore = atsScore;
    if (grammar !== undefined) resume.grammar = grammar;
    if (keywords !== undefined) resume.keywords = keywords;
    if (skills !== undefined) resume.skills = skills;
    if (suggestions !== undefined) resume.suggestions = suggestions;

    await resume.save();

    res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    res.status(500).json({
      message: "Failed to update resume",
      error: error.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await resume.deleteOne();

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    res.status(500).json({
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};

const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (!resume.resumeText || !resume.resumeText.trim()) {
      return res.status(400).json({
        message:
          "Resume text is empty. Please make sure the resume text was extracted during upload.",
      });
    }

    const response = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `
Analyze the following resume.

Resume:
${resume.resumeText}

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "atsScore": 0,
  "grammar": 0,
  "keywords": [],
  "skills": [],
  "suggestions": []
}

Rules:

overallScore:
Give an overall resume score from 0 to 100.

atsScore:
Give an ATS compatibility score from 0 to 100.

grammar:
Give a grammar and writing quality score from 0 to 100.

keywords:
Return important job-related keywords found in the resume.
Return as an array of strings.

skills:
Return technical and professional skills found in the resume.
Return as an array of strings.

suggestions:
Return 4 to 6 useful suggestions for improving the resume.
Return as an array of strings.

Do not include Markdown.
Do not include explanations outside the JSON.
`,
    });

    let result = response.output_text;

    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(result);
    } catch (error) {
      console.error("Gemini returned invalid JSON:", result);

      return res.status(500).json({
        message: "AI returned an invalid analysis format",
      });
    }

    resume.overallScore = Number(analysis.overallScore) || 0;
    resume.atsScore = Number(analysis.atsScore) || 0;
    resume.grammar = Number(analysis.grammar) || 0;
    resume.keywords = Array.isArray(analysis.keywords) ? analysis.keywords : [];
    resume.skills = Array.isArray(analysis.skills) ? analysis.skills : [];
    resume.suggestions = Array.isArray(analysis.suggestions)
      ? analysis.suggestions
      : [];

    await resume.save();

    res.status(200).json({
      message: "Resume analyzed successfully",
      resume,
    });
  } catch (error) {
    console.error("Resume AI analysis error:", error);

    res.status(500).json({
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
};

module.exports = {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  analyzeResume,
};
