const Resume = require("../models/Resume");

const createResume = async (req, res) => {
  const {
    userId,
    fileName,
    fileSize,
    fileUrl,
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
};

const getResumes = async (req, res) => {
  const { userId } = req.params;

  const resumes = await Resume.find({ userId });

  res.status(200).json({
    message: "Resumes found",
    resumes,
  });
};

const getResume = async (req, res) => {
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
};

const updateResume = async (req, res) => {
  const { resumeId } = req.params;

  const {
    fileName,
    fileSize,
    fileUrl,
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
};
const deleteResume = async (req, res) => {
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
};

const analyzeResume = async (req, res) => {
  const { resumeId } = req.params;

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }

  // Later we will connect the AI here.

  resume.overallScore = 80;
  resume.atsScore = 75;
  resume.grammar = 85;

  resume.keywords = ["JavaScript", "React", "Node.js"];
  resume.skills = ["React", "Node.js", "MongoDB"];

  resume.suggestions = [
    "Add more projects",
    "Improve summary",
    "Add certificates",
    "Improve formatting",
  ];

  await resume.save();

  res.status(200).json({
    message: "Resume analyzed successfully",
    resume,
  });
};

module.exports = {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  analyzeResume,
};
