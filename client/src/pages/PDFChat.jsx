import "../styles/PDFChat.css";

export default function PDFChat() {
  return (
    <div className="pdfchat">
      {/* Header */}

      <div className="pdfHeader">
        <h1>Nova AI</h1>

        <h2>PDF Chat</h2>

        <button>+ Upload PDF</button>
      </div>

      <div className="pdf-container">
        <div className="pdfupload">
          <h3>📄 Uploaded PDF</h3>

          <div className="pdf-card">
            <p>
              <strong>Name:</strong> DBMS Notes.pdf
            </p>

            <p>
              <strong>Size:</strong> 3.2 MB
            </p>

            <p>
              <strong>Pages:</strong> 42
            </p>

            <p className="pdfstatus">✅ Ready to Chat</p>
          </div>
        </div>

        {/* Ask Question */}

        <div className="pdfask">
          <h3>❓ Ask Anything About Your PDF</h3>

          <textarea
            rows="4"
            placeholder="Type your question here..."
          ></textarea>

          <button>Ask Question</button>
        </div>

        {/* AI Response */}

        <div className="pdfresponse">
          <h3>🤖 Nova AI Response</h3>

          <div className="pdfresponse-card">
            <p>
              According to the uploaded PDF, the answer to your question will
              appear here once you ask something.
            </p>
          </div>
        </div>

        {/* Bottom Buttons */}

        <div className="pdfbutton">
          <button>🗑 Clear Chat</button>

          <button>⬇ Download Summary</button>
        </div>
      </div>
    </div>
  );
}
