const Email = require("../models/Email");
const { GoogleGenAI } = require("@google/genai");

const genai = new GoogleGenAI({
  apiKey: process.env.Email_GEMINI_API_KEY,
});

const createEmail = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { subject, purpose, tone, content, generatedEmail } = req.body;

    const newEmail = await Email.create({
      userId,
      subject,
      purpose,
      tone,
      content,
      generatedEmail,
    });

    res.status(201).json({
      message: "New Email generated",
      newEmail,
    });
  } catch (error) {
    console.error("Create email error:", error);

    res.status(500).json({
      message: "Failed to create email",
    });
  }
};

const getEmails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const emails = await Email.find({ userId });

    res.status(200).json({
      message: "The Emails found",
      emails,
    });
  } catch (error) {
    console.error("Get emails error:", error);

    res.status(500).json({
      message: "Failed to get emails",
    });
  }
};

const getEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.userId;

    const email = await Email.findOne({
      _id: emailId,
      userId,
    });

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Found Email",
      email,
    });
  } catch (error) {
    console.error("Get email error:", error);

    res.status(500).json({
      message: "Failed to get email",
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.userId;

    const { subject, purpose, tone, content, generatedEmail } = req.body;

    const email = await Email.findOne({
      _id: emailId,
      userId,
    });

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    if (subject !== undefined) email.subject = subject;
    if (purpose !== undefined) email.purpose = purpose;
    if (tone !== undefined) email.tone = tone;
    if (content !== undefined) email.content = content;
    if (generatedEmail !== undefined) {
      email.generatedEmail = generatedEmail;
    }

    await email.save();

    res.status(200).json({
      message: "Email updated successfully",
      email,
    });
  } catch (error) {
    console.error("Update email error:", error);

    res.status(500).json({
      message: "Failed to update email",
    });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.userId;

    const email = await Email.findOne({
      _id: emailId,
      userId,
    });

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    await email.deleteOne();

    res.status(200).json({
      message: "Email was deleted successfully",
      email,
    });
  } catch (error) {
    console.error("Delete email error:", error);

    res.status(500).json({
      message: "Failed to delete email",
    });
  }
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
