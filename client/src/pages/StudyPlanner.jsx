import "../styles/StudyPlanner.css";
import { useEffect, useState } from "react";

export default function StudyPlanner() {
  const userId = localStorage.getItem("userId");

  const [generatedPlan, setGeneratedPlan] = useState("");
  const [studies, setStudies] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const [selectedStudy, setSelectedStudy] = useState(null);
  const [progress, setProgress] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  const [goal, setGoal] = useState("");

  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    getStudies();
  }, []);

  async function getStudies() {
    try {
      if (!userId) return;

      const response = await fetch(
        `http://localhost:5000/api/study/user/${userId}`,
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load study plans.");
        return;
      }

      setStudies(data.study);
    } catch (error) {
      console.error("Failed to get studies:", error);
      setError("Failed to load study plans.");
    }
  }

  function handleNewPlan() {
    setTitle("");
    setSubject("");
    setStartDate("");
    setEndDate("");
    setDailyHours("");
    setGoal("");

    setError("");
    setStatusMessage("");

    setShowForm(true);
  }

  async function handleCreatePlan() {
    setError("");
    setStatusMessage("");

    if (!title || !subject || !startDate || !endDate || !dailyHours || !goal) {
      setError("Please fill all fields.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title,
          subject,
          startDate,
          endDate,
          dailyHours,
          goal,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStudies((previous) => [...previous, data.study]);

        setShowForm(false);

        setStatusMessage("Study plan created successfully.");
      } else {
        setError(data.message || "Failed to create study plan.");
      }
    } catch (error) {
      console.error("Failed to create study plan:", error);
      setError("Something went wrong while creating the plan.");
    }
  }

  function handleGeneratePlan() {
    setError("");
    setStatusMessage("");

    if (studies.length === 0) {
      setError("Create a study plan first.");
      return;
    }

    setSelectedStudy(null);
    setGenerateOpen(true);
  }

  async function generateSelectedPlan() {
    setError("");
    setStatusMessage("");

    if (!selectedStudy) {
      setError("Please select a study plan.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/study/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: selectedStudy.subject,
          goal: selectedStudy.goal,
          dailyHours: selectedStudy.dailyHours,
          startDate: selectedStudy.startDate,
          endDate: selectedStudy.endDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedPlan(data.plan);

        setGenerateOpen(false);
        setSelectedStudy(null);

        setStatusMessage("AI study plan generated successfully.");
      } else {
        setError(data.message || "Failed to generate study plan.");
      }
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setError("Something went wrong while generating the plan.");
    }
  }

  async function handleDeletePlan(studyId) {
    setError("");
    setStatusMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/study/${studyId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStudies((previous) =>
          previous.filter((study) => study._id !== studyId),
        );

        if (selectedStudy?._id === studyId) {
          setSelectedStudy(null);
        }

        setStatusMessage("Study plan deleted.");
      } else {
        setError(data.message || "Failed to delete study plan.");
      }
    } catch (error) {
      console.error("Failed to delete plan:", error);
      setError("Something went wrong while deleting the plan.");
    }
  }

  async function handleUpdateProgress() {
    setError("");
    setStatusMessage("");

    if (!selectedStudy || progress === "") {
      setError("Please select a study plan and enter progress.");
      return;
    }

    const newProgress = Number(progress);

    if (newProgress < 0 || newProgress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/study/${selectedStudy._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: selectedStudy.title,
            startDate: selectedStudy.startDate,
            subject: selectedStudy.subject,
            endDate: selectedStudy.endDate,
            dailyHours: selectedStudy.dailyHours,
            completedHours: selectedStudy.dailyHours * (newProgress / 100),
            progress: newProgress,
            goal: selectedStudy.goal,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStudies((previous) =>
          previous.map((study) =>
            study._id === selectedStudy._id ? data.study : study,
          ),
        );

        setProgressOpen(false);
        setProgress("");
        setSelectedStudy(null);

        setStatusMessage("Progress updated successfully.");
      } else {
        setError(data.message || "Failed to update progress.");
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      setError("Something went wrong while updating progress.");
    }
  }

  return (
    <div className="studyPlanner">
      {/* ================= HEADER ================= */}

      <header className="studyHeader">
        <div className="studyLogo">
          <span>✨</span>
          Nova AI
        </div>

        <h2>Study Planner</h2>

        <button onClick={handleNewPlan}>+ New Plan</button>
      </header>

      {/* ================= MAIN ================= */}

      <main className="studyMain">
        {error && <div className="studyMessage studyError">{error}</div>}

        {statusMessage && (
          <div className="studyMessage studySuccess">{statusMessage}</div>
        )}

        {/* TODAY'S SUBJECTS */}

        <section className="studycard1">
          <div className="studyCardHeader">
            <div>
              <h2>Today's Subjects</h2>
              <p>Subjects included in your study plans.</p>
            </div>

            <span className="studyCount">{studies.length}</span>
          </div>

          {studies.length === 0 ? (
            <div className="studyEmpty">
              <span>📚</span>
              <p>No study plans yet.</p>
            </div>
          ) : (
            <div className="subjectList">
              {studies.map((study) => (
                <div className="subjectItem" key={study._id}>
                  <div className="subjectIcon">📖</div>

                  <div>
                    <strong>{study.subject}</strong>
                    <span>{study.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* STUDY GOALS */}

        <section className="studycard2">
          <div className="studyCardHeader">
            <div>
              <h2>Study Goals</h2>
              <p>Track your plans, hours and progress.</p>
            </div>

            <span className="studyCount">{studies.length}</span>
          </div>

          {studies.length === 0 ? (
            <div className="studyEmpty">
              <span>🎯</span>
              <p>Create a study plan to see your goals.</p>
            </div>
          ) : (
            <div className="studyPlans">
              {studies.map((study) => {
                const start = new Date(study.startDate);
                const end = new Date(study.endDate);

                const days =
                  Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                const totalHours = days * Number(study.dailyHours);

                const completedHours =
                  totalHours * (Number(study.progress || 0) / 100);

                const remainingHours = totalHours - completedHours;

                return (
                  <div className="studyPlan" key={study._id}>
                    <div className="studyPlanTop">
                      <div>
                        <h3>{study.title}</h3>
                        <span>{study.subject}</span>
                      </div>

                      <strong>{study.progress || 0}%</strong>
                    </div>

                    <div className="studyProgress">
                      <div
                        style={{
                          width: `${study.progress || 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="studyStats">
                      <div>
                        <span>Total</span>
                        <b>{totalHours}h</b>
                      </div>

                      <div>
                        <span>Done</span>
                        <b>{completedHours.toFixed(1)}h</b>
                      </div>

                      <div>
                        <span>Left</span>
                        <b>{remainingHours.toFixed(1)}h</b>
                      </div>

                      <div>
                        <span>Today</span>
                        <b>{study.dailyHours}h</b>
                      </div>
                    </div>

                    <button
                      className="studyDelete"
                      onClick={() => handleDeletePlan(study._id)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* AI SUGGESTIONS */}

        <section className="studycard3">
          <div className="studyCardHeader">
            <div>
              <h2>AI Suggestions</h2>
              <p>Let Nova create a study plan for you.</p>
            </div>

            <span className="aiStudyTag">AI Powered</span>
          </div>

          <div className="studySuggestion">
            <h3>Nova AI recommends:</h3>

            {generatedPlan ? (
              <div className="generatedStudyPlan">{generatedPlan}</div>
            ) : (
              <div className="studyEmpty">
                <span>✨</span>
                <p>
                  Generate an AI study plan for one of your existing study
                  plans.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM BUTTONS */}

        <div className="studybottombuttons">
          <button onClick={handleGeneratePlan}>✨ Generate Plan</button>

          <button
            onClick={() => {
              setError("");
              setStatusMessage("");

              if (studies.length === 0) {
                setError("Create a study plan first.");
                return;
              }

              setSelectedStudy(null);
              setProgress("");
              setProgressOpen(true);
            }}
          >
            📊 Update Progress
          </button>
        </div>
      </main>

      {/* ================= CREATE PLAN MODAL ================= */}

      {showForm && (
        <div className="studyModal">
          <div className="studyForm">
            <div className="modalHeader">
              <div>
                <h2>Create Study Plan</h2>
                <p>Set up a new study goal.</p>
              </div>

              <button className="modalClose" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>

            <label>Plan Title</label>

            <input
              placeholder="Example: Final Exam Preparation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Subject</label>

            <input
              placeholder="Example: Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="dateFields">
              <div>
                <label>Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label>End Date</label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <label>Daily Hours</label>

            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="Example: 2"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
            />

            <label>Study Goal</label>

            <textarea
              placeholder="Example: Complete all chapters and revise important questions."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <div className="modalButtons">
              <button className="primaryModalButton" onClick={handleCreatePlan}>
                Create Plan
              </button>

              <button
                className="secondaryModalButton"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPDATE PROGRESS MODAL ================= */}

      {progressOpen && (
        <div className="studyModal">
          <div className="studyForm">
            <div className="modalHeader">
              <div>
                <h2>Update Progress</h2>
                <p>Update your current study progress.</p>
              </div>

              <button
                className="modalClose"
                onClick={() => {
                  setProgressOpen(false);
                  setSelectedStudy(null);
                  setProgress("");
                }}
              >
                ×
              </button>
            </div>

            <label>Select Study Plan</label>

            <select
              value={selectedStudy?._id || ""}
              onChange={(e) => {
                const study = studies.find(
                  (item) => item._id === e.target.value,
                );

                setSelectedStudy(study);
                setProgress(study?.progress || 0);
              }}
            >
              <option value="">Select Study Plan</option>

              {studies.map((study) => (
                <option key={study._id} value={study._id}>
                  {study.title} - {study.subject}
                </option>
              ))}
            </select>

            <label>Progress</label>

            <div className="progressInput">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Progress %"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />

              <span>%</span>
            </div>

            <div className="modalButtons">
              <button
                className="primaryModalButton"
                onClick={handleUpdateProgress}
              >
                Save Progress
              </button>

              <button
                className="secondaryModalButton"
                onClick={() => {
                  setProgressOpen(false);
                  setSelectedStudy(null);
                  setProgress("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GENERATE PLAN MODAL ================= */}

      {generateOpen && (
        <div className="studyModal">
          <div className="studyForm">
            <div className="modalHeader">
              <div>
                <h2>Generate Study Plan</h2>
                <p>Choose an existing plan for Nova to analyze.</p>
              </div>

              <button
                className="modalClose"
                onClick={() => {
                  setGenerateOpen(false);
                  setSelectedStudy(null);
                }}
              >
                ×
              </button>
            </div>

            <label>Select Study Plan</label>

            <select
              value={selectedStudy?._id || ""}
              onChange={(e) => {
                const study = studies.find(
                  (item) => item._id === e.target.value,
                );

                setSelectedStudy(study);
              }}
            >
              <option value="">Select Study Plan</option>

              {studies.map((study) => (
                <option key={study._id} value={study._id}>
                  {study.title} - {study.subject}
                </option>
              ))}
            </select>

            <div className="modalButtons">
              <button
                className="primaryModalButton"
                onClick={generateSelectedPlan}
              >
                ✨ Generate
              </button>

              <button
                className="secondaryModalButton"
                onClick={() => {
                  setGenerateOpen(false);
                  setSelectedStudy(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
