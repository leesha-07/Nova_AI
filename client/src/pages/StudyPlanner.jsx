import "../styles/StudyPlanner.css";
export default function StudyPlanner() {
  return (
    <div className="studyPlanner">
      <div className="studyHeader">
        <h1>Nova AI</h1>

        <h2>Study Planner</h2>

        <button>+ New Plan</button>
      </div>
      <div className="studyMain">
        <div className="studycard1">
          <h2>Todays Subject</h2>
          <p>DBMS</p>
          <p>React</p>
          <p>Java</p>
        </div>
        <div className="studycard2">
          <h2>Study Goals</h2>
          <p>Hours Completed 3.5 hrs</p>
          <p>Hours Remaining 2 hrs</p>
          <p>██████████░░░░░░ 65%</p>
          <p>Target Today : 6 hrs</p>
        </div>
        <div className="studycard3">
          <h2>Ai Suggestions</h2>
          <h3>Nova AI recommends: </h3>
          <p>Finish React</p>
          <p>Revise DBMS</p>
        </div>
        <div className="studybottombuttons">
          <button>Generate Plan</button>
          <button>Update Progress</button>
        </div>
      </div>
    </div>
  );
}
