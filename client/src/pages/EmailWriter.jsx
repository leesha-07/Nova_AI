import "../styles/EmailWriter.css";
export default function EmailWriter() {
  return (
    <div className="emailwriter">
      <div className="emailHeader">
        <h1>Nova AI</h1>

        <h2>Email Writer</h2>

        <button>+ New Email</button>
      </div>
      <div className="emailmainContainer">
        <div className="email">
          <label>Recipient</label>
          <input type="text" placeholder="john@gmail.com" />
          <label>Subject</label>
          <input type="text" placeholder="Leave Application" />
        </div>
        <div className="emailprompt">
          <h3>Describe your email</h3>
          <textarea
            placeholder="Write a professional leave application..."
            rows="5"
          ></textarea>
        </div>
        <div className="aiemail">
          <h3>AI Generated Email</h3>
          <p>
            Dear Sir,
            <br></br>I hope you are doing well.<br></br>I would like to request
            leave...<br></br>Thank you.<br></br>Regards,
            <br></br>Leesha
          </p>
          <br></br>
        </div>
        <div className="emailbottombuttons">
          <button>✨ Generate Email </button>
          <button>📋 Copy </button>
          <button>📤 Send</button>
        </div>
      </div>
    </div>
  );
}
