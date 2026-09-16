const Email = require("../models/Email");
const { GoogleGenAI } = require("@google/genai");

const genai = new GoogleGenAI({
  apiKey: process.env.Email_GEMINI_API_KEY,
});
const createEmail = async (req, res) => {
  const { userId, subject, purpose, tone, content, generatedEmail } = req.body;
  const newEmail = await Email.create({
    userId,
    subject,
    purpose,
    tone,
    content,
    generatedEmail,
  });
  res.status(201).json({ message: "New Email generated", newEmail });
};
const getEmails = async (req, res) => {
  const { userId } = req.params;
  const emails = await Email.find({ userId });
  res.status(200).json({ message: "The Emails found", emails });
};
const getEmail = async (req, res) => {
  const { emailId } = req.params;
  const email = await Email.findById(emailId);
  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }
  res.status(200).json({ message: "Found Email", email });
};
const updateEmail = async (req, res) => {
  const { emailId } = req.params;
  const { subject, purpose, tone, content, generatedEmail } = req.body;
  const email = await Email.findById(emailId);
  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }
  email.subject = subject;
  email.purpose = purpose;
  email.tone = tone;
  email.content = content;
  email.generatedEmail = generatedEmail;
  await email.save();
  res.status(200).json({ message: "Email updated successfully", email });
};
const deleteEmail = async (req, res) => {
  const { emailId } = req.params;
  const email = await Email.findById(emailId);
  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }
  await email.deleteOne();
  res.status(200).json({ message: "Email was deleted successfully", email });
};
const generateEmail = async (req, res) => {
  try {
    const { recipient, subject, purpose, tone, content } = req.body;

    if (!recipient || !subject || !purpose) {
      return res.status(400).json({
        message: "Recipient, subject and purpose are required",
      });
    }

    const response = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `Write a ${tone || "professional"} email.

Recipient: ${recipient}
Subject: ${subject}

Purpose:
${purpose}

Additional instructions:
${content || "None"}

Write only the email body.
Do not include explanations before or after the email.
Use simple Markdown formatting only when useful.`,
    });

    res.status(200).json({
      message: "Email generated successfully",
      generatedEmail: response.output_text,
    });
  } catch (error) {
    console.error("Email generation error:", error);

    res.status(500).json({
      message: "Failed to generate email",
      error: error.message,
    });
  }
};
module.exports = {
  createEmail,
  getEmails,
  getEmail,
  updateEmail,
  deleteEmail,
  generateEmail,
};
