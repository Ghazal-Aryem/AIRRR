import React from "react";
import { Link } from "react-router-dom";
import "./second.css"; // CSS file for styling
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "./assets/logo2.png";
function second() {
  return (
    
    <nav className="navbar">
      <div className="navbar-left">
      <img src={Logo} alt="Airrr logo" className="logo"/>
        
        
      </div>
      <div className="navbar-right">
      <Link to="/login">
          <button className="btn btn-signup">Log Out</button>
        </Link>
        
      </div>
    </nav>
  );
}

export default second;
