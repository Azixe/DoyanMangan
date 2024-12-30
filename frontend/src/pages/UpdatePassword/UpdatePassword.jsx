import React, { useContext, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./UpdatePassword.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract the reset token from the URL
  const navigate = useNavigate(); // Hook for navigation
  const { url } = useContext(StoreContext);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return false;
    }
    setMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      const response = await axios.post(url + "/api/user/update-password", { token, password });
      if (response.data.success) {
        setMessage("Password updated successfully!");
        setTimeout(() => navigate("/"), 2000); // Redirect to home after 2 seconds
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error updating password. Please try again.");
    }
  };

  return (
    <div className="mainDiv">
      <div className="cardStyle">
        <form id="signupForm" onSubmit={handleSubmit}>
          <img src={assets.logo} id="signupLogo" alt="Logo" />
          <h2 className="formTitle">Reset Your Password</h2>

          <div className="inputDiv">
            <label className="inputLabel" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="inputDiv">
            <label className="inputLabel" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyUp={validatePassword}
              required
            />
          </div>

          <div className="buttonWrapper">
            <button type="submit" id="submitButton" className="submitButton">
              <span>Continue</span>
            </button>
          </div>

          {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;