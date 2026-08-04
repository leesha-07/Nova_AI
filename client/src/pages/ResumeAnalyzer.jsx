import "../styles/ResumeAnalyzer.css";
export default function ResumeAnalyser() {
  return (
    <div className="ResumeAnalyzer">
      <div className="resumeHeader">
        <h1>Nova AI</h1>

        <h2>Resume Analyzer</h2>

        <button>+ Upload Resume</button>
      </div>
      <div className="resumeMain">
        <div className="resumeuploadCard">
          <button>Upload Resumer</button>
          <p>File Name</p>
          <p>File Size</p>
        </div>
        <div className="resumeanalysiscard">
          <p>Overall Score</p>
          <p>ATS Score</p>
          <p>Grammar</p>
          <p>Keywords</p>
          <p>Skills</p>
        </div>
        <div className="resumeAisuggestion">
          <h2>🤖 AI Suggestions</h2>
          <button>Add Project</button>
          <button>Improve Summary</button>
          <button>Add Cerificate</button>
          <button>Better Formatting</button>
        </div>
        <div className="resumebottombuttons">
          <button>Analyze Again</button>
          <button>Download Report</button>
        </div>
      </div>
    </div>
  );
}
