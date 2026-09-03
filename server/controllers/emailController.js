const Email = require("../models/Email");
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
module.exports = { createEmail, getEmails, getEmail, updateEmail, deleteEmail };
