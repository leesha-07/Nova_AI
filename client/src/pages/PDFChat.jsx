import { useState, useEffect } from "react";
import "../styles/PDFChat.css";
import ReactMarkdown from "react-markdown";

export default function PDFChat() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedPdfRecord, setSelectedPdfRecord] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function getPdfs() {
      if (!userId || !token) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/pdf/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setPdfs(data.pdfs);
      } catch (error) {
        console.error("Failed to get PDFs:", error);
      }
    }

    getPdfs();
  }, [userId, token]);

  const fileSize = selectedPdf ? selectedPdf.size / (1024 * 1024) : 0;

  async function uploadPdf() {
    if (!selectedPdf) {
      alert("Please select a PDF first.");
      return;
    }

    if (!userId || !token) {
      alert("User is not logged in.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("pdf", selectedPdf);

      const response = await fetch("http://localhost:5000/api/pdf/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        alert(data.message || "PDF upload failed.");
        return;
      }

      setPdfs((previous) => [...previous, data.pdf]);

      setSelectedPdf(null);
    } catch (error) {
      console.error("PDF upload failed:", error);
      alert("PDF upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function selectPdf(pdf) {
    setSelectedPdfRecord(pdf);
    setQuestion("");
    setAnswer("");
  }

  async function askQuestion() {
    if (!selectedPdfRecord) {
      alert("Please select a PDF first.");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const response = await fetch(
        `http://localhost:5000/api/pdf/ask/${selectedPdfRecord._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: question,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        alert(data.message || "Failed to answer PDF question.");
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("Failed to ask PDF question:", error);
      alert("Failed to answer PDF question.");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setQuestion("");
    setAnswer("");
  }

  async function deletePdf(pdfId) {
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/pdf/${pdfId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        alert(data.message || "Failed to delete PDF.");
        return;
      }

      setPdfs((previous) => previous.filter((pdf) => pdf._id !== pdfId));

      if (selectedPdfRecord?._id === pdfId) {
        setSelectedPdfRecord(null);
        setQuestion("");
        setAnswer("");
      }
    } catch (error) {
      console.error("Failed to delete PDF:", error);
      alert("Failed to delete PDF.");
    }
  }

  return (
    <div className="pdfchat">
      {/* ================= HEADER ================= */}

      <header className="pdfHeader">
        <div className="pdfBrand">
          <h1>Nova AI</h1>
          <span>PDF Chat</span>
        </div>

        <div className="pdfUploadArea">
          <label className="pdfChooseButton">
            Choose PDF
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                const file = event.target.files[0];

                if (!file) {
                  return;
                }

                if (file.type !== "application/pdf") {
                  alert("File type should be PDF.");
                  event.target.value = "";
                  return;
                }

                if (file.size / (1024 * 1024) > 10) {
                  alert("File size should be less than 10 MB.");
                  event.target.value = "";
                  return;
                }

                setSelectedPdf(file);
              }}
            />
          </label>

          {selectedPdf && (
            <div className="selectedFile">
              <span className="selectedFileName">{selectedPdf.name}</span>

              <span className="selectedFileSize">{fileSize.toFixed(2)} MB</span>
            </div>
          )}

          <button
            type="button"
            className="uploadPdfButton"
            onClick={uploadPdf}
            disabled={!selectedPdf || uploading}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}

      <main className="pdf-container">
        {/* ================= PDF LIBRARY ================= */}

        <section className="pdfupload">
          <div className="sectionHeader">
            <div>
              <h2>Your PDFs</h2>
              <p>Select a PDF to start asking questions.</p>
            </div>

            <span className="pdfCount">
              {pdfs.length} {pdfs.length === 1 ? "PDF" : "PDFs"}
            </span>
          </div>

          {pdfs.length === 0 ? (
            <div className="pdfEmptyState">
              <div className="emptyIcon">📄</div>

              <h3>No PDFs uploaded yet</h3>

              <p>
                Upload a PDF above and Nova AI will extract its content for you.
              </p>
            </div>
          ) : (
            <div className="pdfList">
              {pdfs.map((pdf) => {
                const isSelected = selectedPdfRecord?._id === pdf._id;

                return (
                  <div
                    className={`pdf-card ${isSelected ? "selected-pdf" : ""}`}
                    key={pdf._id}
                  >
                    <div className="pdfCardInfo">
                      <div className="pdfFileIcon">PDF</div>

                      <div className="pdfFileDetails">
                        <h3>{pdf.fileName}</h3>

                        <div className="pdfMeta">
                          <span className="readyStatus">
                            <span className="statusDot"></span>
                            Ready to Chat
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pdfCardActions">
                      <button
                        type="button"
                        className={
                          isSelected ? "selectedButton" : "selectButton"
                        }
                        onClick={() => selectPdf(pdf)}
                      >
                        {isSelected ? "✓ Selected" : "Select PDF"}
                      </button>

                      <button
                        type="button"
                        className="deleteButton"
                        onClick={() => deletePdf(pdf._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= CHAT AREA ================= */}

        <section className="pdfChatWorkspace">
          {/* SELECTED PDF */}

          <div className="selectedPdfBar">
            <div className="selectedPdfIcon">PDF</div>

            {selectedPdfRecord ? (
              <div className="selectedPdfContent">
                <span>Currently chatting with</span>
                <strong>{selectedPdfRecord.fileName}</strong>
              </div>
            ) : (
              <div className="selectedPdfContent">
                <span>No PDF selected</span>
                <strong>Select a PDF above to start chatting</strong>
              </div>
            )}
          </div>

          {/* QUESTION */}

          <div className="pdfask">
            <div className="sectionHeader">
              <div>
                <h2>Ask Nova</h2>
                <p>Ask anything about the selected PDF.</p>
              </div>
            </div>

            <textarea
              rows="5"
              placeholder={
                selectedPdfRecord
                  ? "Example: Summarize the main points of this PDF..."
                  : "Select a PDF first..."
              }
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={!selectedPdfRecord || loading}
            ></textarea>

            <div className="questionActions">
              <span className="questionHint">
                {selectedPdfRecord
                  ? "Nova will answer using the information in this PDF."
                  : "Select a PDF before asking a question."}
              </span>

              <button
                type="button"
                onClick={askQuestion}
                disabled={!selectedPdfRecord || !question.trim() || loading}
              >
                {loading ? "Nova is thinking..." : "Ask Nova"}
              </button>
            </div>
          </div>

          {/* RESPONSE */}

          <div className="pdfresponse">
            <div className="responseHeader">
              <div>
                <h2>Nova AI Response</h2>
                <p>Answers based on your selected PDF.</p>
              </div>

              {answer && <span className="responseBadge">AI Answer</span>}
            </div>

            <div className="pdfresponse-card">
              {loading ? (
                <div className="loadingState">
                  <div className="loadingDots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <h3>Nova is thinking...</h3>

                  <p>Reading your PDF and preparing an answer.</p>
                </div>
              ) : answer ? (
                <div className="markdownResponse">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              ) : selectedPdfRecord ? (
                <div className="responseEmptyState">
                  <div className="responseIcon">🤖</div>

                  <h3>Ask Nova anything</h3>

                  <p>
                    You can ask for a summary, explanation, specific
                    information, important points, conclusions, or anything else
                    contained in the PDF.
                  </p>
                </div>
              ) : (
                <div className="responseEmptyState">
                  <div className="responseIcon">📚</div>

                  <h3>Your PDF answers will appear here</h3>

                  <p>
                    Select an uploaded PDF and ask Nova a question to get
                    started.
                  </p>
                </div>
              )}
            </div>

            {/* CHAT ACTIONS */}

            <div className="pdfbutton">
              <button
                type="button"
                onClick={clearChat}
                disabled={!question && !answer}
              >
                Clear Chat
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
