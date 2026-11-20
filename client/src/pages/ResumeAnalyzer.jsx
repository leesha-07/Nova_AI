import "../styles/ResumeAnalyzer.css";
import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";
export default function ResumeAnalyser() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [file, setFile] = useState(null);

  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getResumes();
  }, []);

  async function getResumes() {
    try {
      if (!userId || !token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/resume/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load resumes.");
        return;
      }

      setResumes(data.resumes);
    } catch (error) {
      console.error("Failed to get resumes:", error);
      setError("Failed to load resumes.");
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setError("");
    setStatusMessage("");

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF resume.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleUploadResume() {
    setError("");
    setStatusMessage("");

    if (!file) {
      setError("Please select a resume.");
      return;
    }

    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResumes((previous) => [...previous, data.resume]);

        setSelectedResume(data.resume);
        setFile(null);

        setStatusMessage("Resume uploaded successfully.");
      } else {
        setError(data.message || "Failed to upload resume.");
      }
    } catch (error) {
      console.error("Failed to upload resume:", error);
      setError("Something went wrong while uploading the resume.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyzeResume() {
    setError("");
    setStatusMessage("");

    if (!selectedResume) {
      setError("Please upload or select a resume first.");
      return;
    }

    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setAnalyzing(true);

      const response = await fetch(
        `${API_BASE_URL}/api/resume/${selectedResume._id}/analyze`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSelectedResume(data.resume);

        setResumes((previous) =>
          previous.map((resume) =>
            resume._id === data.resume._id ? data.resume : resume,
          ),
        );

        setStatusMessage("Resume analyzed successfully.");
      } else {
        setError(data.message || "Failed to analyze resume.");
      }
    } catch (error) {
      console.error("Failed to analyze resume:", error);
      setError("Something went wrong while analyzing the resume.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDeleteResume() {
    setError("");
    setStatusMessage("");

    if (!selectedResume) {
      setError("Please select a resume.");
      return;
    }

    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/api/resume/${selectedResume._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setResumes((previous) =>
          previous.filter((resume) => resume._id !== selectedResume._id),
        );

        setSelectedResume(null);

        setStatusMessage("Resume deleted successfully.");
      } else {
        setError(data.message || "Failed to delete resume.");
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
      setError("Something went wrong while deleting the resume.");
    } finally {
      setDeleting(false);
    }
  }

  function selectResume(resumeId) {
    const resume = resumes.find((item) => item._id === resumeId);

    setSelectedResume(resume);
    setFile(null);
    setError("");
    setStatusMessage("");
  }

  return (
    <div className="ResumeAnalyzer">
      {/* ================= HEADER ================= */}

      <header className="resumeHeader">
        <div className="resumeLogo">
          <span>✨</span>
          Nova AI
        </div>

        <h2>Resume Analyzer</h2>

        <div className="resumeHeaderAction">
          <button
            type="button"
            onClick={() => document.getElementById("resumeInput").click()}
          >
            + Upload Resume
          </button>

          <input
            id="resumeInput"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            hidden
          />
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="resumeMain">
        {error && <div className="resumeMessage resumeError">{error}</div>}

        {statusMessage && (
          <div className="resumeMessage resumeSuccess">{statusMessage}</div>
        )}

        {/* ================= RESUME ================= */}

        <section className="resumeuploadCard">
          <div className="resumeCardHeader">
            <div>
              <h2>Resume</h2>
              <p>Upload and manage your saved resumes.</p>
            </div>

            <span className="resumeCount">{resumes.length}</span>
          </div>

          {file && (
            <div className="selectedResume">
              <div className="resumeFileIcon">PDF</div>

              <div className="resumeFileInfo">
                <strong>{file.name}</strong>

                <span>{(file.size / 1024).toFixed(1)} KB</span>
              </div>

              <button
                type="button"
                className="saveResumeButton"
                onClick={handleUploadResume}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Resume"}
              </button>
            </div>
          )}

          {!file && !selectedResume && (
            <div className="resumeEmptyState">
              <div className="resumeEmptyIcon">📄</div>

              <h3>No resume selected</h3>

              <p>Upload a PDF resume or select one from your saved resumes.</p>
            </div>
          )}

          {selectedResume && !file && (
            <div className="selectedResume">
              <div className="resumeFileIcon">PDF</div>

              <div className="resumeFileInfo">
                <strong>{selectedResume.fileName}</strong>

                <span>{(selectedResume.fileSize / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}

          {resumes.length > 0 && (
            <div className="savedResumeSelector">
              <label>Select Saved Resume</label>

              <select
                value={selectedResume?._id || ""}
                onChange={(e) => selectResume(e.target.value)}
              >
                <option value="">Select Saved Resume</option>

                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.fileName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* ================= ANALYSIS ================= */}

        <section className="resumeanalysiscard">
          <div className="resumeCardHeader">
            <div>
              <h2>Resume Analysis</h2>
              <p>AI-based evaluation of your resume.</p>
            </div>

            <span className="aiTag">AI Powered</span>
          </div>

          <div className="analysisStats">
            <div className="analysisItem mainScore">
              <span>Overall Score</span>
              <strong>{selectedResume?.overallScore || 0}%</strong>
            </div>

            <div className="analysisItem">
              <span>ATS Score</span>
              <strong>{selectedResume?.atsScore || 0}%</strong>
            </div>

            <div className="analysisItem">
              <span>Grammar</span>
              <strong>{selectedResume?.grammar || 0}%</strong>
            </div>

            <div className="analysisItem">
              <span>Keywords</span>
              <strong>{selectedResume?.keywords?.length || 0}</strong>
            </div>

            <div className="analysisItem">
              <span>Skills</span>
              <strong>{selectedResume?.skills?.length || 0}</strong>
            </div>
          </div>
        </section>

        {/* ================= AI SUGGESTIONS ================= */}

        <section className="resumeAisuggestion">
          <div className="resumeCardHeader">
            <div>
              <h2>AI Suggestions</h2>
              <p>Recommendations to improve your resume.</p>
            </div>

            <span className="suggestionIcon">✨</span>
          </div>

          {selectedResume?.suggestions?.length > 0 ? (
            <div className="suggestionList">
              {selectedResume.suggestions.map((suggestion, index) => (
                <div className="suggestionItem" key={index}>
                  <span>✓</span>
                  <p>{suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="resumeSuggestionEmpty">
              <span>🤖</span>

              <p>Analyze your resume to get AI suggestions.</p>
            </div>
          )}
        </section>

        {/* ================= BUTTONS ================= */}

        <div className="resumebottombuttons">
          <button
            type="button"
            onClick={handleAnalyzeResume}
            disabled={!selectedResume || analyzing}
          >
            {analyzing ? "Analyzing..." : "✨ Analyze Resume"}
          </button>

          <button
            type="button"
            className="deleteResumeButton"
            onClick={handleDeleteResume}
            disabled={!selectedResume || deleting}
          >
            {deleting ? "Deleting..." : "Delete Resume"}
          </button>
        </div>
      </main>
    </div>
  );
}
