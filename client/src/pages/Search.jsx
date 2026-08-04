import "../styles/Search.css";
export default function Search() {
  return (
    <div className="search">
      <div className="searchHeader">
        <h1>Nova AI</h1>

        <h2>AI Search</h2>

        <button>Quick Search</button>
      </div>
      <div className="searchMain">
        <div className="searchinputcard">
          <input type="text" placeholder="Search...."></input>
          <button>Search</button>
        </div>
        <div className="searchresultcard">
          <h2>Search Results</h2>
          <p>Search result 1</p>
          <p>Search result 2</p>
          <p>Search result 3</p>
        </div>
        <div className="searchaisummary">
          <h2>AI Summary</h2>
          <p>Nova Ai Summary.....</p>
        </div>
        <div className="searchbuttoncard">
          <div className="searchbottombuttons">
            <button>New Search</button>
            <button>Save Result</button>
          </div>
        </div>
      </div>
    </div>
  );
}
