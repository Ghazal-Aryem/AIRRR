import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./first.css"; // CSS file for styling
import { useNavigate } from "react-router-dom";
import img from "./assets/img3.jpg";
import { toast } from 'react-toastify';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/userValidation/user/login',
        { email, password },
        { withCredentials: true }
      );
      setMessage(response.data.message);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/Userr');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error("Login failed. Please check your credentials.");
      } else {
        setMessage('An unexpected error occurred. Please try again.');
        console.error(error);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = 'http://localhost:8080/api/userValidation/googlelogin';
    } catch (error) {
      console.error('Error initiating Google Login:', error);
      toast.error('An unexpected error occurred. Please try again.');
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
              className="bg-light p-5 rounded "
              style={{
                textAlign:"center",
                  color: "black",
                  marginRight: "5%",width:"30%"
              }} // Adding black background and white text color
          >
              <h1>LOGIN</h1>
              <div className="mb-3">
                  {/* Email Input */}
                  <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control"
                  />
              </div>
              <div className="mb-3">
                  {/* Password Input */}
                  <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control"
                  />
              </div>
              <button onClick={handleLogin} className="btn btn-sign">
                  Login
              </button>
              {message && <p className="login-message text-center mt-3">{message}</p>}
              <button onClick={handleGoogleLogin} className="btn btn-sign">
                  Login with google
              </button>
              {/*<button onClick={handleGoogleLogin} className="google-login-button mt-3">
                  <span className="google-text">Login With Google</span>
              </button>*/}

              <Link to="/register" className="btn btn-link mt-3 d-block text-center text-dark">
                  Signup Here!
              </Link>
              <Link to="/adm_login" className="btn btn-link mt-3 d-block text-center">
                  Admin login
              </Link>
          </div>
      </div>
  );
}

export default Login;
