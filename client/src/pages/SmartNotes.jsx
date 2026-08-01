import "../styles/SmartNotes.css";

export default function SmartNotes() {
  return (
    <div className="note">
      <div className="leftPanel">
        <button className="newnote">+ New Note</button>

        <input
          className="search"
          type="text"
          placeholder="Search notes..."
        ></input>

        <div>
          <h2>All Notes</h2>
          <div className="allnotes">
            <p>📄 DBMS Notes</p>
            <p>📄 React Note</p>
            <p>📄 JavaScriipt Notes</p>
            <p>📄 Resume Ideas</p>
            <p>📄 Meeting Notes</p>
          </div>
        </div>
      </div>
      <div className="rightPanel">
        <h2>My Note</h2>

        <input type="text" placeholder="Enter note title..."></input>

        <textarea
          className="textarea"
          placeholder="Start writing your notes here..."
          rows="8"
        ></textarea>
        <div>
          <h2>AI Tools</h2>
          <div className="tools">
            <button>Summarize</button>
            <button>Rewrite</button>
            <button>Translate</button>
          </div>
        </div>

        <button className="buttons">Save</button>
      </div>
    </div>
  );
}
