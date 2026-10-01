import { useEffect, useState } from "react";
import "../styles/EmailWriter.css";
import ReactMarkdown from "react-markdown";

export default function EmailWriter() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [content, setContent] = useState("");

  const [generatedEmail, setGeneratedEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function getEmails() {
      if (!userId || !token) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/email/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setEmails(data.emails);
        }
      } catch (error) {
        console.error("Failed to get emails:", error);
      }
    }

    getEmails();
  }, [userId, token]);

  function handleNewEmail() {
    setRecipient("");
    setSubject("");
    setPurpose("");
    setTone("Professional");
    setContent("");
    setGeneratedEmail("");
    setSelectedEmail(null);
    setError("");
    setStatusMessage("");
  }

  async function generateEmail() {
    setError("");
    setStatusMessage("");

    if (!recipient.trim()) {
      setError("Please enter the recipient.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter the subject.");
      return;
    }

    if (!purpose.trim()) {
      setError("Please describe what the email should be about.");
      return;
    }

    try {
      setLoading(true);
      setGeneratedEmail("");

      const response = await fetch("http://localhost:5000/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          subject,
          purpose,
          tone,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to generate email.");
        return;
      }

      setGeneratedEmail(data.generatedEmail);
    } catch (error) {
      console.error("Failed to generate email:", error);
      setError("Something went wrong while generating the email.");
    } finally {
      setLoading(false);
    }
  }

  async function saveEmail() {
    if (!generatedEmail) {
      return;
    }

    if (!token) {
      setError("Authentication required.");
      return;
    }

    setError("");
    setStatusMessage("");

    try {
      setSaving(true);

      const response = await fetch("http://localhost:5000/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          purpose,
          tone,
          content,
          generatedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save email.");
        return;
      }

      setEmails((previous) => [data.newEmail, ...previous]);
      setSelectedEmail(data.newEmail);
      setStatusMessage("Email saved successfully.");
    } catch (error) {
      console.error("Failed to save email:", error);
      setError("Something went wrong while saving the email.");
    } finally {
      setSaving(false);
    }
  }

  async function copyEmail() {
    if (!generatedEmail) return;

    try {
      await navigator.clipboard.writeText(generatedEmail);
      setStatusMessage("Email copied.");
      setError("");

      setTimeout(() => {
        setStatusMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
      setError("Failed to copy the email.");
    }
  }

  function selectEmail(email) {
    setSelectedEmail(email);
    setSubject(email.subject);
    setPurpose(email.purpose);
    setTone(email.tone);
    setContent(email.content);
    setGeneratedEmail(email.generatedEmail);
    setRecipient("");
    setError("");
    setStatusMessage("");
  }

  async function deleteEmail(emailId) {
    setError("");
    setStatusMessage("");

    if (!token) {
      setError("Authentication required.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/email/${emailId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete email.");
        return;
      }

      setEmails((previous) =>
        previous.filter((email) => email._id !== emailId),
      );

      if (selectedEmail?._id === emailId) {
        handleNewEmail();
      }
    } catch (error) {
      console.error("Failed to delete email:", error);
      setError("Something went wrong while deleting the email.");
    }
  }

  return (
    <div className="emailwriter">
      <header className="emailHeader">
        <div className="emailLogo">
          <span>✨</span>
          Nova AI
        </div>

        <h2>Email Writer</h2>

        <button
          className="newEmailButton"
          type="button"
          onClick={handleNewEmail}
        >
          + New Email
        </button>
      </header>

      <main className="emailmainContainer">
        {error && <div className="emailError">{error}</div>}

        {statusMessage && <div className="emailStatus">{statusMessage}</div>}

        <section className="email">
          <div className="sectionTitle">
            <div>
              <h2>Email Details</h2>
              <p>Tell Nova who the email is for and how it should sound.</p>
            </div>
          </div>

          <div className="emailFields">
            <div className="emailField">
              <label>Recipient</label>

              <input
                type="email"
                placeholder="john@gmail.com"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
              />
            </div>

            <div className="emailField">
              <label>Subject</label>

              <input
                type="text"
                placeholder="Leave Application"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>

            <div className="emailField">
              <label>Tone</label>

              <select
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              >
                <option>Professional</option>
                <option>Formal</option>
                <option>Friendly</option>
                <option>Polite</option>
                <option>Casual</option>
              </select>
            </div>
          </div>
        </section>

        <section className="emailprompt">
          <div className="sectionTitle">
            <div>
              <h2>Describe Your Email</h2>
              <p>Explain what you want Nova to write.</p>
            </div>

            <span className="aiTag">AI Powered</span>
          </div>

          <textarea
            placeholder="Example: Write a professional leave application because I have an exam tomorrow..."
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
          />

          <div className="generateArea">
            <span>Nova will turn your instructions into a complete email.</span>

            <button type="button" onClick={generateEmail} disabled={loading}>
              {loading ? "Nova is writing..." : "✨ Generate Email"}
            </button>
          </div>
        </section>

        <section className="aiemail">
          <div className="generatedHeader">
            <div>
              <h2>AI Generated Email</h2>
              <p>Review your email before saving or copying it.</p>
            </div>

            {generatedEmail && (
              <span className="generatedBadge">✓ Generated</span>
            )}
          </div>

          <div className="generatedEmailBox">
            {loading ? (
              <div className="emailLoading">
                <div className="loadingDots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <h3>Nova is writing your email...</h3>

                <p>Creating a {tone.toLowerCase()} email.</p>
              </div>
            ) : generatedEmail ? (
              <div className="emailMarkdown">
                <ReactMarkdown>{generatedEmail}</ReactMarkdown>
              </div>
            ) : (
              <div className="emailEmptyState">
                <div className="emailEmptyIcon">✉</div>

                <h3>Your generated email will appear here</h3>

                <p>
                  Add the email details above and tell Nova what you want to
                  write.
                </p>
              </div>
            )}
          </div>

          <div className="emailActions">
            <button
              type="button"
              onClick={generateEmail}
              disabled={loading || !purpose.trim()}
            >
              ✨ Regenerate
            </button>

            <button
              type="button"
              onClick={copyEmail}
              disabled={!generatedEmail}
            >
              📋 Copy
            </button>

            <button
              className="saveButton"
              type="button"
              onClick={saveEmail}
              disabled={!generatedEmail || saving}
            >
              {saving ? "Saving..." : "💾 Save Email"}
            </button>
          </div>
        </section>

        <section className="savedEmails">
          <div className="sectionTitle">
            <div>
              <h2>Saved Emails</h2>
              <p>Access your previously generated emails.</p>
            </div>

            <span className="emailCount">{emails.length}</span>
          </div>

          {emails.length === 0 ? (
            <div className="savedEmailEmpty">
              <span>✉</span>
              <p>No saved emails yet.</p>
            </div>
          ) : (
            <div className="savedEmailList">
              {emails.map((email) => (
                <div
                  className={`savedEmailCard ${
                    selectedEmail?._id === email._id ? "activeEmail" : ""
                  }`}
                  key={email._id}
                >
                  <div className="savedEmailInfo">
                    <div className="savedEmailIcon">✉</div>

                    <div>
                      <h3>{email.subject}</h3>

                      <p>
                        {email.tone} · {email.purpose}
                      </p>
                    </div>
                  </div>

                  <div className="savedEmailActions">
                    <button type="button" onClick={() => selectEmail(email)}>
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteEmail(email._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
