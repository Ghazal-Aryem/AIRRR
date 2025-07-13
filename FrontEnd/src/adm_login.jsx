import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./first.css"; // CSS file for styling
import { useNavigate } from "react-router-dom";
import img from "./assets/img3.jpg";

function AdminLogin() {
  const [uniqueKey, setUniqueKey] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/adminValidation/admlogin", {
        unique_key: uniqueKey,
        password: password,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        // Redirect to the admin dashboard or another page after successful login
        setTimeout(() => {
          navigate("/admin_dashboard");
        }, 1000);
      } else {
        setMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }
  };

  return (
      <div
          className="d-flex justify-content-end align-items-center vh-100"
          style={{
            backgroundImage: `url(${img})`,  // Correct way to apply the background image
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
      >
        <div
            className="bg-light p-5 rounded w-30 "
            style={{

              color: "black",
              marginRight: "8%"
            }} // Adding black background and white text color
        >
          <h1 className="text-center mb-4">Admin Login</h1>
          <form onSubmit={handleLogin}>
            {/* Unique Key Input */}
            <div className="mb-3">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Unique Key"
                  value={uniqueKey}
                  onChange={(e) => setUniqueKey(e.target.value)}
                  required
              />
            </div>
            {/* Password Input */}
            <div className="mb-3">
              <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            {/* Submit Button */}
            <button type="submit" className="btn btn-sign">
              Log In
            </button>

          </form>
          {message && <p className="mt-3 text-center text-success">{message}</p>}
          <div className="text-center mt-3">
            <Link to="/login" className="btn btn-link text-dark">
              GO BACK
            </Link>
          </div>
        </div>
      </div>
  );
}

export default AdminLogin;