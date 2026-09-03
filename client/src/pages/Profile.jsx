import "../styles/Profile.css";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
export default function Profile() {
  const [profile, setProfile] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function getProfile() {
      const response = await fetch(
        `http://localhost:5000/api/profile/${userId}`,
      );

      const data = await response.json();

      setProfile(data.profile);
    }

    getProfile();
  }, [userId]);

  function handleEditProfile() {
    setName(profile.name);
    setEmail(profile.email);
    setLocation(profile.location);

    setEditMode(true);
  }

  async function handleSaveProfile() {
    const response = await fetch(
      `http://localhost:5000/api/profile/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          location: location,
        }),
      },
    );

    const data = await response.json();

    setProfile(data.profile);
    setEditMode(false);
  }
  async function handleChangePassword() {
    const response = await fetch(
      `http://localhost:5000/api/auth/change-password/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      },
    );

    const data = await response.json();

    alert(data.message);
    if (response.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordOpen(false);
    }
  }
  function handleLogout() {
    localStorage.removeItem("userId");
    setLogoutOpen(false);
    navigate("/");
  }
  return (
    <>
      <div className="profileCard">
        <div className="profileCardHeader">
          <div className="profileAvatar">
            {profile?.name
              ? profile.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
              : "U"}
          </div>

          <div>
            <h3>{profile?.name}</h3>
            <p>{profile?.email}</p>
          </div>
        </div>

        <div className="profileCardInfo">
          <p>📍 {profile?.location}</p>
        </div>

        <div className="profileCardButtons">
          <button onClick={handleEditProfile}>✏️ Edit Profile</button>

          <button onClick={() => setChangePasswordOpen(true)}>
            🔒 Change Password
          </button>

          <button onClick={() => setLogoutOpen(true)}>🚪 Logout</button>
        </div>
      </div>

      {editMode && (
        <div className="editProfileOverlay">
          <div className="editProfileCard">
            <div className="editProfileHeader">
              <h2>✏️ Edit Profile</h2>

              <button onClick={() => setEditMode(false)}>✕</button>
            </div>

            <div className="editProfileForm">
              <label>Name</label>

              <input value={name} onChange={(e) => setName(e.target.value)} />

              <label>Email</label>

              <input value={email} onChange={(e) => setEmail(e.target.value)} />

              <label>Location</label>

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <button onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {changePasswordOpen && (
        <div className="changePasswordOverlay">
          <div className="changePasswordModal">
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleChangePassword}>Change Password</button>
            <button onClick={() => setChangePasswordOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {logoutOpen && (
        <div className="logoutOverlay">
          <div className="logoutModal">
            <h2>Logout</h2>
            <p>Are you sure you want to logout?</p>

            <button onClick={handleLogout}>Yes, Logout</button>

            <button onClick={() => setLogoutOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
