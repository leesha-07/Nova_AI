const { GoogleGenAI } = require("@google/genai");

const Todo = require("../models/Todo");
const Reminder = require("../models/Reminder");
const Study = require("../models/Study");

const { executeNovaActions } = require("../services/novaActionService");

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const emailGenai = new GoogleGenAI({
  apiKey: process.env.Email_GEMINI_API_KEY,
});

const chatUser = async (req, res) => {
  try {
    const { message, interactionID } = req.body;
    const userId = req.user.userId;

    /*
    ==================================================
    VALIDATION
    ==================================================
    */

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    /*
    ==================================================
    GET USER DATA
    ==================================================
    */

    const todos = await Todo.find({ userId });
    const reminders = await Reminder.find({ userId });
    const studies = await Study.find({ userId });

    const productivityContext = `
USER'S CURRENT PRODUCTIVITY DATA

TODOS:
${JSON.stringify(todos)}

REMINDERS:
${JSON.stringify(reminders)}

STUDY PLANS:
${JSON.stringify(studies)}

Use this information when answering questions about
the user's productivity.

Do not invent productivity data.
`;

    /*
    ==================================================
    ASK GEMINI TO DETECT ALL ACTIONS
    ==================================================
    */

    const actionResponse = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",

      input: `
You are Nova AI, an intelligent productivity assistant.

Analyze the user's message and determine whether it
contains one or more productivity actions.

IMPORTANT:

The user can request MULTIPLE actions in ONE message.

You must detect ALL requested actions.

Possible actions:

CREATE_TODO
UPDATE_TODO
COMPLETE_TODO
DELETE_TODO

CREATE_REMINDER
UPDATE_REMINDER
DELETE_REMINDER

CREATE_STUDY_PLAN
UPDATE_STUDY_PLAN
DELETE_STUDY_PLAN

CREATE_NOTE
UPDATE_NOTE
DELETE_NOTE
GET_NOTE

GET_EMAILS
CREATE_EMAIL
UPDATE_EMAIL
DELETE_EMAIL

If the user only asks a normal question, return:

{
  "actions": []
}

Return ONLY valid JSON.

The JSON must have this exact structure:

{
  "actions": [
    {
      "type": "ACTION_NAME",
      "data": {}
    }
  ]
}

Do not include Markdown.
Do not include explanations.


==================================================
CREATE TODO
==================================================

Data:

{
  "title": "task title",
  "content": "task details",
  "priority": "Low",
  "dueDate": "YYYY-MM-DD"
}

Priority must be:

Low
Medium
High

If priority is not specified:

Medium

If due date is not specified:

null


==================================================
UPDATE TODO
==================================================

Data:

{
  "todoId": "existing todo id",
  "title": "new title or null",
  "content": "new content or null",
  "priority": "Low/Medium/High or null",
  "dueDate": "YYYY-MM-DD or null"
}

The user may give the task name instead of MongoDB ID.

Use the available Todo data to identify the correct Todo.

Available Todos:

${JSON.stringify(todos)}


==================================================
COMPLETE TODO
==================================================

Data:

{
  "todoId": "existing todo id",
  "title": "todo title if known"
}

The user may give the task name instead of ID.

Available Todos:

${JSON.stringify(todos)}


==================================================
DELETE TODO
==================================================

Data:

{
  "todoId": "existing todo id",
  "title": "todo title if known"
}

The user may give the task name instead of ID.

Available Todos:

${JSON.stringify(todos)}


==================================================
CREATE REMINDER
==================================================

Data:

{
  "title": "reminder title",
  "message": "reminder message",
  "reminderDate": "YYYY-MM-DD",
  "reminderTime": "HH:MM",
  "status": "pending",
  "todoId": null
}

Use 24-hour time.

Examples:

7 PM = 19:00
8:30 AM = 08:30

Today's date in India:

${new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date())}

If the user says tomorrow, next Monday, etc.,
calculate the correct date.

If the reminder is connected to an existing Todo,
use its Todo ID.

Available Todos:

${JSON.stringify(todos)}


==================================================
UPDATE REMINDER
==================================================

Data:

{
  "reminderId": "existing reminder id",
  "title": "new title or null",
  "message": "new message or null",
  "reminderDate": "YYYY-MM-DD or null",
  "reminderTime": "HH:MM or null",
  "status": "pending/sent/completed or null"
}

The user may give the reminder title instead of ID.

Available Reminders:

${JSON.stringify(reminders)}


==================================================
DELETE REMINDER
==================================================

Data:

{
  "reminderId": "existing reminder id",
  "title": "reminder title if known"
}

The user may give the reminder title instead of ID.

Available Reminders:

${JSON.stringify(reminders)}


==================================================
CREATE STUDY PLAN
==================================================

Data:

{
  "title": "study plan title",
  "subject": "subject",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "dailyHours": 1,
  "goal": "study goal",
  "status": "planned"
}

Rules:

If title is not specified,
create a suitable short title.

If start date is not specified,
use today's date.

If end date is not specified,
use null.

If daily hours are not specified,
use 1.

The goal should contain the user's requested study goal.


==================================================
UPDATE STUDY PLAN
==================================================

Data:

{
  "studyId": "existing study plan id",
  "title": "new title or null",
  "subject": "new subject or null",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "dailyHours": 1,
  "goal": "new goal or null",
  "status": "planned/completed or null",
  "completedHours": 0,
  "progress": 0
}

The user may give the study plan title instead of ID.

Available Study Plans:

${JSON.stringify(studies)}


==================================================
DELETE STUDY PLAN
==================================================

Data:

{
  "studyId": "existing study plan id",
  "title": "study plan title if known"
}

The user may give the study plan title instead of ID.

Available Study Plans:

${JSON.stringify(studies)}


==================================================
CREATE NOTE
==================================================

Data:

{
  "title": "note title",
  "content": "note content"
}

Only create a note if the user explicitly asks
Nova to save, remember, write down, or create a note.


==================================================
UPDATE NOTE
==================================================

Data:

{
  "noteId": "existing note id",
  "title": "new title or null",
  "content": "new content or null",
  "summary": "new summary or null"
}

The user may give the note title instead of ID.


==================================================
DELETE NOTE
==================================================

Data:

{
  "noteId": "existing note id",
  "title": "note title if known"
}

The user may give the note title instead of ID.

==================================================
GET NOTE
==================================================

Use this action when the user asks Nova to:

- find a note
- show a note
- retrieve a note
- read a note
- show the content of a note
- find my note titled ...
- what is inside my note ...
- show me the complete content of my note

Data:

{
  "noteId": "existing note id or null",
  "title": "note title or null"
}

The user may give the note title instead of MongoDB ID.

If the user gives a note title, put the exact title in "title".

If the user gives a MongoDB ID, put it in "noteId".

Do not invent note content.

The system will retrieve the actual note from the database.

Example:

User:
Find my note titled "Nova AI Documentation" and show me the complete content.

Return:

{
  "actions": [
    {
      "type": "GET_NOTE",
      "data": {
        "noteId": null,
        "title": "Nova AI Documentation"
      }
    }
  ]
}
==================================================
GET EMAILS
==================================================

Use this action when the user asks things such as:

- show my emails
- list my saved emails
- what emails have I created
- show my generated emails
- find my email about my sister

Data:

{
  "query": "search text or null"
}

If the user wants all emails:

{
  "query": null
}


==================================================
CREATE EMAIL
==================================================

Use this action when the user asks Nova to:

- generate an email
- write an email
- draft an email
- create an email
- compose an email

Data:

{
  "subject": "email subject",
  "purpose": "why the email is being written",
  "tone": "professional/warm/friendly/formal/casual/etc.",
  "content": "additional instructions for the email"
}

IMPORTANT:

Do NOT generate the final email body yourself.

Only extract the information needed by the Email AI.

The Email AI will generate the actual email body later.


==================================================
UPDATE EMAIL
==================================================

Data:

{
  "emailId": "existing email id",
  "subject": "new subject or null",
  "purpose": "new purpose or null",
  "tone": "new tone or null",
  "content": "new instructions or null",
  "generatedEmail": "new email body or null"
}

The user may give the email subject instead of MongoDB ID.

Available saved Emails will be used later to identify
the correct email.


==================================================
DELETE EMAIL
==================================================

Data:

{
  "emailId": "existing email id",
  "subject": "email subject if known"
}

The user may give the email subject instead of ID.


==================================================
IMPORTANT EMAIL RULE
==================================================

If the user says:

"Generate an email to my sister because I am far away
completing my studies and wish her a happy 23rd birthday."

Return:

{
  "actions": [
    {
      "type": "CREATE_EMAIL",
      "data": {
        "subject": "Happy 23rd Birthday",
        "purpose": "Write a birthday email to my sister because I am far away completing my studies.",
        "tone": "warm and loving",
        "content": "Wish her a happy 23rd birthday and express love despite being far away."
      }
    }
  ]
}

Do not return the complete email body.

The Email AI will generate it.


==================================================
MULTIPLE ACTIONS
==================================================

A single message may contain MANY actions.

Example:

"I have my DSA exam on September 20.
Create a study plan, create a task to finish Unit 1,
remind me tomorrow at 7 PM, save the exam information
in my notes, and generate an email to my sister."

Return each action separately.

Do NOT stop after the first action.

Do NOT combine multiple actions into one action.


==================================================
NORMAL QUESTIONS
==================================================

If the user only asks a normal question:

{
  "actions": []
}==================================================
PDF ACTIONS
==================================================

GET_PDFS

Data:

{}


ASK_PDF

Data:

{
  "pdfId": "PDF ID or null",
  "fileName": "PDF file name or null",
  "question": "question about the PDF"
}

Rules:

If the user specifies a PDF by name,
use fileName.

If the user provides a PDF ID,
use pdfId.

If the user says "this PDF" or does not specify a PDF,
use null for pdfId and fileName.

The system will use the user's latest PDF
when no specific PDF is provided.


SUMMARIZE_PDF

Data:

{
  "pdfId": "PDF ID or null",
  "fileName": "PDF file name or null"
}

Rules:

If the user specifies a PDF by name,
use fileName.

If the user provides a PDF ID,
use pdfId.

If no PDF is specified,
use null for both.


==================================================
RESUME ACTIONS
==================================================

GET_RESUMES

Data:

{}


ANALYZE_RESUME

Data:

{
  "resumeId": "Resume ID or null",
  "fileName": "Resume file name or null"
}

Rules:

If the user specifies a resume by name,
use fileName.

If the user provides a resume ID,
use resumeId.

If the user says "my resume" or does not specify
which resume, use null for both.

The system will use the user's latest saved resume.


==================================================
NORMAL QUESTIONS
==================================================

If the user only asks a normal question:

{
  "actions": []
}


==================================================
USER MESSAGE
==================================================

${message}
      `,
    });

    /*
    ==================================================
    PARSE GEMINI ACTION RESPONSE
    ==================================================
    */

    let actionData;

    try {
      let actionText = actionResponse.output_text.trim();

      actionText = actionText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      actionData = JSON.parse(actionText);
    } catch (error) {
      console.error(
        "Failed to parse Nova action response:",
        actionResponse.output_text,
      );

      actionData = {
        actions: [],
      };
    }

    let actions = Array.isArray(actionData.actions) ? actionData.actions : [];

    console.log("Nova actions before processing:", actions);

    /*
    ==================================================
    EMAIL AI PROCESSING
    ==================================================
    
    CREATE_EMAIL needs generatedEmail because the
    Email MongoDB model requires it.

    Chat detects the CREATE_EMAIL action first.
    Then the separate Email AI generates the body.
    Finally executeNovaActions() saves the email.
    ==================================================
    */

    for (const action of actions) {
      if (action.type === "CREATE_EMAIL") {
        try {
          const data = action.data || {};

          const subject = data.subject || "New Email";
          const purpose = data.purpose || message;
          const tone = data.tone || "professional";
          const content = data.content || "None";

          const emailResponse = await emailGenai.interactions.create({
            model: "gemini-3.1-flash-lite",

            input: `
You are the Email AI module of Nova AI.

Write an email based on the following information.

Subject:
${subject}

Purpose:
${purpose}

Tone:
${tone}

Additional instructions:
${content}

Write only the email body.

Do not include explanations before or after the email.

Do not include a subject line.

Do not use placeholders such as [Name] unless the user
did not provide the required name.

Keep the email natural and appropriate to the request.
            `,
          });

          action.data.generatedEmail = emailResponse.output_text;

          console.log("Email AI generated email successfully.");
        } catch (error) {
          console.error("Email AI generation error:", error);

          action.data.generatedEmail = null;

          action.emailGenerationFailed = true;
          action.emailGenerationError = error.message;
        }
      }
    }

    /*
    ==================================================
    REMOVE EMAIL ACTIONS THAT FAILED GENERATION
    ==================================================
    */

    actions = actions.filter((action) => {
      if (action.type === "CREATE_EMAIL" && action.emailGenerationFailed) {
        return false;
      }

      return true;
    });

    console.log("Nova actions after processing:", actions);

    /*
    ==================================================
    NO ACTION
    ==================================================
    */

    if (actions.length === 0) {
      const response = await genai.interactions.create({
        model: "gemini-3.1-flash-lite",

        input: `
You are Nova AI, the user's personal productivity assistant.

${productivityContext}

Answer the user's message normally.

You can answer questions about:

- Todos
- Reminders
- Study Plans
- Productivity

You can also answer normal general questions.

Do not invent productivity data.

User's message:

${message}
        `,

        previous_interaction_id: interactionID,
      });

      return res.status(201).json({
        message: response.output_text,
        interactionID: response.id,
      });
    }

    /*
    ==================================================
    EXECUTE ALL ACTIONS
    ==================================================
    */

    const actionResults = await executeNovaActions(actions, userId, message);

    console.log("Nova action results:", actionResults);

    /*
    ==================================================
    SUCCESS / FAILURE
    ==================================================
    */

    const successfulActions = actionResults.filter((result) => result.success);

    const failedActions = actionResults.filter((result) => !result.success);

    let actionSummary = "";

    /*
    Successful actions
    */

    if (successfulActions.length > 0) {
      actionSummary += `
Successfully completed:

${successfulActions.map((result) => `- ${result.message}`).join("\n")}
`;
    }

    /*
    Failed actions
    */

    if (failedActions.length > 0) {
      actionSummary += `
Could not complete:

${failedActions.map((result) => `- ${result.message}`).join("\n")}
`;
    }

    /*
    ==================================================
    FINAL AI RESPONSE
    ==================================================
    */

    const finalResponse = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",

      input: `
You are Nova AI, the user's personal productivity assistant.

The user requested:

${message}

Nova executed the requested actions.

Execution results:

${JSON.stringify(actionResults, null, 2)}

Respond naturally and clearly.

IMPORTANT RULES:

- Use the actual data returned in the execution results.
- If a GET_NOTE action succeeded, show the ACTUAL note title and COMPLETE note content to the user.
- Do not replace note content with placeholders.
- Do not invent or modify note content.
- Do not summarize the note when the user asks for the complete content.
- If the note content is long, still provide the complete content.
- If an action failed, explain what could not be completed.
- Do not claim that an action was completed unless it appears in the execution results.
- Do not invent additional actions.

If the user asked to find or show a note, directly provide the retrieved note content.

Respond naturally and briefly for normal actions.
  `,

      previous_interaction_id: interactionID,
    });
    console.log(finalResponse);

    /*
    ==================================================
    RETURN RESPONSE
    ==================================================
    */

    return res.status(201).json({
      message: finalResponse.output_text,
      interactionID: finalResponse.id,
      actions: actionResults,
    });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      message: "Failed to get AI response",
      error: error.message,
    });
  }
};

module.exports = {
  chatUser,
};
