import React from "react";
import { Link } from "react-router-dom";
import "./first.css"; // CSS file for styling
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "./assets/logo2.png";
function first() {
  return (
    <nav className="nav">
      <div className="navbar-left ">
      <img src={Logo} alt="Job description" className="logo  "/>
        
      </div>

      <div className="navbar-right ">
      <Link to="/register">
          <button className="btn btn-signup">Sign up</button>
        </Link>
        <Link to="/login">
        <button className="btn btn-login">Log in</button>
        </Link>
      </div>
    </nav>
  );
}

export default first;
