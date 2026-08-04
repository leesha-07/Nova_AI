import "../styles/SmartNotes.css";

export default function SmartNotes() {
  return (
    <div className="note">
      <div className="noteHeader">
        <h1>Nova AI</h1>
        <h2>Smart Notes</h2>
        <button className="newnote">+ New Note</button>
      </div>

      <div className="noteContent">
        <div className="noteleftPanel">
          <input
            className="notesearch"
            type="text"
            placeholder="Search notes..."
          />

          <div>
            <h2>All Notes</h2>
            <div className="allnotes">
              <p>📄 DBMS Notes</p>
              <p>📄 React Note</p>
              <p>📄 JavaScript Notes</p>
              <p>📄 Resume Ideas</p>
              <p>📄 Meeting Notes</p>
            </div>
          </div>
        </div>

        <div className="noterightPanel">
          <h2>My Note</h2>

          <input type="text" placeholder="Enter note title..." />

          <textarea
            className="notetextarea"
            placeholder="Start writing your notes here..."
            rows="8"
          ></textarea>

          <div className="noteaiTools">
            <h2>AI Tools</h2>
            <div className="notetools">
              <button>Summarize</button>
              <button>Rewrite</button>
              <button>Translate</button>
            </div>
          </div>

          <button className="notebuttons">Save</button>
        </div>
      </div>
    </div>
  );
}
