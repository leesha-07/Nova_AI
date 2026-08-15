const { GoogleGenAI } = require("@google/genai");
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatUser = async (req, res) => {
  const { message, interactionID } = req.body;
  const response = await genai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: message,
    previous_interaction_id: interactionID,
  });

  console.log(response);
  res
    .status(201)
    .json({ message: response.output_text, interactionID: response.id });
};
module.exports = { chatUser };
