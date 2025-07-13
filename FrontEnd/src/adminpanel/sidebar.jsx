import React from 'react';
import { Link } from 'react-router-dom';
import { BsGrid1X2Fill, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import './sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logo from "./logo2.png";

function Sidebar({ isSidebarExpanded, toggleSidebar }) {
  return (
    <aside id="sidebar" className={isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
           {isSidebarExpanded && <img src={Logo} alt="Airrr logo" className="logo"/>}
        </div>
        <div className="bars">
          <FaBars onClick={toggleSidebar} />
        </div>
      </div>

      <ul className="sidebar-list">
      <li className="sidebar-list-item">
        <Link to="/dashboard" className="sidebar-link">
          <BsGrid1X2Fill className="icon" />
          {isSidebarExpanded && " Dashboard"}
        </Link>
      </li>

      <li className="sidebar-list-item">
        <Link to="/candidatee" className="sidebar-link">
          <i className="fas fa-user-tie"></i>
          {isSidebarExpanded && " Candidates"}
        </Link>
      </li>
      <li className="sidebar-list-item">
        <Link to="/matching" className="sidebar-link">
        <i className="fas fa-puzzle-piece"></i>

          {isSidebarExpanded && " Matching"}
        </Link>
      </li>
      <li className="sidebar-list-item">
        <Link to="/extraction" className="sidebar-link">
        <i className="fas fa-external-link-alt"></i>
          {isSidebarExpanded && " Extraction"}
        </Link>
      </li>
      <li className="sidebar-list-item">
        <Link to="/analytics" className="sidebar-link">
          <i className="fas fa-chart-line"></i>
          {isSidebarExpanded && " Analytics"}
        </Link>
      </li>
      <li className="sidebar-list-item">
        <Link to="/jd" className="sidebar-link">
        <i className="fas fa-briefcase"></i>
          {isSidebarExpanded && " Job Post"}
        </Link>
      </li>
      <li className="sidebar-list-item">
        <Link to="/login" className="sidebar-link">
        <i className="fas fa-sign-out-alt"></i>
          {isSidebarExpanded && " Log Out"}
        </Link>
      </li>
      
    </ul>
    </aside>
  );
}

export default Sidebar;
