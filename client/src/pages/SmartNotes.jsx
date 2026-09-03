import "../styles/SmartNotes.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
export default function SmartNotes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");
  const [summarizingNoteId, setSummarizingNoteId] = useState(null);
  const [summaryError, setSummaryError] = useState("");
  const [summaryPrompt, setSummaryPrompt] = useState("");
  useEffect(() => {
    async function getNote() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User Id not found");
      }
      const response = await fetch(`http://localhost:5000/api/notes/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data.notes);
      if (data.notes.length > 0) {
        setSelectedNote(data.notes[0]);
      }
    }
    getNote();
  }, []);
  async function saveNote() {
    if (selectedNote === null) {
      throw new Error("The Note is empty");
    } else {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: selectedNote.title,
            content: selectedNote.content,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update note");
      } else {
        setNotes(
          notes.map((note) => {
            if (note._id === selectedNote._id) {
              return selectedNote;
            } else {
              return note;
            }
          }),
        );
      }
    }
  }
  async function createNewNote() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User Id not found");
    }
    const newNote = {
      userId,
      title: "Untitled Note",
      content: "Start writing...",
    };
    const response = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    if (!response.ok) {
      throw new Error("Failed to create note");
    }
    const data = await response.json();
    setNotes([...notes, data.note]);
    setSelectedNote(data.note);
    setSummaryPrompt("");
  }
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );
  async function deleteNote() {
    if (selectedNote === null) {
      return;
    }
    const response = await fetch(
      `http://localhost:5000/api/notes/${selectedNote._id}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      throw new Error("Note not found");
    }
    const updatedNotes = notes.filter((note) => note._id !== selectedNote._id);
    setNotes(updatedNotes);
    setSelectedNote(null);
  }
  async function summarizeNote() {
    setSummaryError(null);
    try {
      if (selectedNote === null) {
        return setSummaryError("Please select a note");
      }
      if (!selectedNote.content || !selectedNote.content.trim()) {
        return setSummaryError("Content is empty so cant summarize it");
      }
      setSummarizingNoteId(selectedNote._id);
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote._id}/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: summaryPrompt,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        return setSummaryError(data.message);
      }
      const updatedNote = { ...selectedNote, summary: data.summary };
      setSelectedNote(updatedNote);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note,
        ),
      );
    } catch (error) {
      setSummaryError("Network is down");
    } finally {
      setSummarizingNoteId(null);
    }
  }

  return (
    <div className="note">
      <div className="noteHeader">
        <h1>Nova AI</h1>
        <h2>Smart Notes</h2>
        <button className="newnote" onClick={createNewNote}>
          + New Note
        </button>
      </div>

      <div className="noteContent">
        <div className="noteleftPanel">
          <input
            className="notesearch"
            type="text"
            placeholder="Search notes..."
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />

          <div className="allnotes">
            {filteredNotes.map((note) => (
              <p
                key={note._id}
                className={selectedNote?._id === note._id ? "selectedNote" : ""}
                onClick={() => {
                  setSelectedNote(note);
                  setSummaryPrompt("");
                }}
              >
                {note.title}
              </p>
            ))}
          </div>
        </div>
        <div className="noterightPanel">
          <h2>My Note</h2>

          <input
            type="text"
            placeholder="Enter note title..."
            value={selectedNote === null ? "" : selectedNote.title}
            onChange={(event) => {
              setSelectedNote({ ...selectedNote, title: event.target.value });
            }}
          />

          <textarea
            className="notetextarea"
            placeholder="Start writing your notes here..."
            rows="8"
            value={selectedNote === null ? "" : selectedNote.content}
            onChange={(event) => {
              setSelectedNote({ ...selectedNote, content: event.target.value });
            }}
          ></textarea>

          <div className="noteaiTools">
            <h2>AI Tools</h2>

            <div className="summaryPromptBox">
              <h3>Summary Instructions</h3>

              <textarea
                className="summaryPrompt"
                placeholder="How do you want me to summarize this note?"
                value={summaryPrompt}
                onChange={(event) => setSummaryPrompt(event.target.value)}
              />
            </div>
            <div className="summaryBox">
              <ReactMarkdown>
                {selectedNote?.summary || "No summary yet"}
              </ReactMarkdown>
            </div>
          </div>

          <div className="Buttons">
            <button
              className="notebuttons"
              onClick={summarizeNote}
              disabled={
                summarizingNoteId === selectedNote?._id ||
                !selectedNote ||
                !selectedNote.content
              }
            >
              {summarizingNoteId === selectedNote?._id
                ? "Summarizing..."
                : "Summarize"}
            </button>
            <button className="savebuttons" onClick={saveNote}>
              💾 Save
            </button>
            <button className="deletebuttons" onClick={deleteNote}>
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
