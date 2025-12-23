// RoleCheckDemo.jsx
import React, { useState } from "react";

// Cookie utility functions
const setCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
};

// Helper function
const isLetterApprovalAuthority = () => {
  const userGroup = JSON.parse(getCookie("userGroup") || "{}");
  return userGroup.code === "015" && userGroup.name === "Letter Approval Authority";
};

const RoleCheckDemo = () => {
  const [user, setUser] = useState(null);

  const loginAsNormalUser = () => {
    const apiResponse = {
      id: 10,
      code: "012",
      name: "Admin",
      status: "ACTIVE",
    };
    setCookie("userGroup", JSON.stringify(apiResponse));
    setUser(apiResponse);
  };

  const loginAsLetterApproval = () => {
    const apiResponse = {
      id: 15,
      code: "015",
      name: "Letter Approval Authority",
      status: "ACTIVE",
    };
    setCookie("userGroup", JSON.stringify(apiResponse));
    setUser(apiResponse);
  };

  const logout = () => {
    setCookie("userGroup", "");
    setUser(null);
  };

  const currentUser = JSON.parse(getCookie("userGroup") || "{}");
  const canSeeComplaintDashboard = isLetterApprovalAuthority();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>🔐 Role Check Demo</h2>
      <button onClick={loginAsNormalUser}>Login as Admin (012)</button>
      <button onClick={loginAsLetterApproval} style={{ marginLeft: "10px" }}>
        Login as Letter Approval Authority (015)
      </button>
      <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>

      <hr />

      {currentUser?.code ? (
        <>
          <p>
            <strong>Current User:</strong> {currentUser.name} ({currentUser.code})
          </p>
          {canSeeComplaintDashboard ? (
            <div style={{ background: "#def", padding: "10px", borderRadius: "8px" }}>
              ✅ Complaint Dashboard Visible (Code 015)
            </div>
          ) : (
            <div style={{ background: "#fed", padding: "10px", borderRadius: "8px" }}>
              ⚙️ Normal Dashboard Visible (Other User)
            </div>
          )}
        </>
      ) : (
        <p>🚪 No user logged in</p>
      )}
    </div>
  );
};

export default RoleCheckDemo;