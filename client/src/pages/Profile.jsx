import "../styles/Profile.css";
export default function Profile() {
  return (
    <div className="profile">
      <div className="profileHeader">
        <h1>Nova AI</h1>

        <h2> Profile</h2>

        <button>Edit profile</button>
      </div>
      <div className="profilemainContent">
        <div className="profileleftcard">
          <h2>👤 Personal Information</h2>
          <div className="personal">
            <p>
              <strong>👤 Name: </strong>Leesha Jain
            </p>
            <p>
              <strong>📧 Email: </strong>jainleesha@gmail.com
            </p>
            <p>
              <strong>📍 Location: </strong>Mumbai
            </p>
            <p>
              <strong>📈 Productivity Level:</strong>82%
            </p>
          </div>
        </div>
        <div className="profilerightcard">
          <h2>📊 Account Stats</h2>
          <div className="profilestats">
            <p>📒 Notes Created: 12</p>
            <p>✅ Task Completed: 18</p>
            <p>📄 PDF uploaded: 5</p>
            <p>📧 Email Generated: 24</p>
          </div>
        </div>

        <div className="profilebottombuttons">
          <h2>⚙️ Account Settings</h2>
          <div className="profilebuttons">
            <button>🔒 Change Password</button>
            <button>🔔 Notifications</button>
            <button>🌙 Dark Mode</button>
            <button>🚪 Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
