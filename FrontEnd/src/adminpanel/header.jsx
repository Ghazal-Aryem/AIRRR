import React from "react";
import "./app.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const header = () => {
  return (
    <div className="header d-flex align-items-center justify-content-between bg-light px-3">
      {/* Left Section - Logo */}
      <div className="header-left d-flex align-items-center">
        <i className="fas fa-shopping-cart header-logo"></i>
        <span className="header-title ms-2">SHOP</span>
      </div>

      {/* Middle Section - Search */}
      <div className="header-middle">
        <i className="fas fa-search header-search-icon"></i>
      </div>

      {/* Right Section - Icons */}
      <div className="header-right d-flex align-items-center">
        <i className="fas fa-bell mx-3"></i>
        <i className="fas fa-envelope mx-3"></i>
        <i className="fas fa-user mx-3"></i>
      </div>
    </div>
  );
};

export default header;
