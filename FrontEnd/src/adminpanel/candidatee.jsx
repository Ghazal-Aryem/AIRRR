import React, { useState, useEffect } from 'react';
import './candidate.css';
import './dashboard.css';
import axios from 'axios';
import Sidebar from './sidebar';
import './App.css';
import Modal from './candidateModal';
import { FaEye, FaEnvelope } from 'react-icons/fa';
import {toast} from "react-toastify";

function Candidatee() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/get_select_user/admin/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      console.log('Fetched notifications:', data.notifications); // Debugging
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter((item) =>
    item.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.resume_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal and set selected candidate
  const openModal = (candidate) => {
    console.log('openModal', candidate); // Debugging
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  // const sendConfirmationEmail = async (candidate) => {
  //   try {
  //     // Assuming you have a backend endpoint to send the email.
  //     const response = await axios.post('http://localhost:8081/api/admin/send-confirmation', {
  //       email: candidate.personal_info[0]?.email,
  //       message: 'Congratulations! You have been selected.',
  //     });
  //
  //     if (response.status === 200) {
  //       toast.error('Confirmation email sent successfully!');
  //
  //       // Remove the candidate from the list
  //       setNotifications((prevNotifications) =>
  //         prevNotifications.filter((item) => item._id !== candidate._id)
  //       );
  //     } else {
  //       alert('Failed to send confirmation email');
  //     }
  //   } catch (error) {
  //     console.error('Error sending confirmation email:', error);
  //   }
  // };
  const handleEmailClick = (email, candidateId) => {
    // Open the default email client with pre-filled email
    window.location.href = `mailto:${email}?subject=Accepted&body=Congratulations! You have been accepted for the position.`;
    toast.success("Email sent succesfully")
    // Remove the candidate from the table
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification._id !== candidateId)
    );
  };
  const viewJob = async (jobId) => {
    try {
        console.log('Job ID:', jobId); // Debugging line
        const response = await fetch(`http://localhost:8080/api/jobs/job_descriptions/${jobId}`);

        if (!response.ok) {
            console.error(`Failed to fetch job description for ID: ${jobId}`);
            alert(`Failed to fetch job details. HTTP Status: ${response.status}`);
            return;
        }

        const jobData = await response.json();

        if (jobData.link) {
            // Open the JD file link in a new tab
            window.open(jobData.link, '_blank');
        } else {
            alert("Job file link is not available.");
        }
    } catch (error) {
        console.error('Error fetching job description:', error);
        alert("An error occurred while fetching the job details. Please try again later.");
    }
};


  return (
      <div className="grid-container">
        <Sidebar
            isSidebarExpanded={isSidebarExpanded}
            toggleSidebar={toggleSidebar}
        />
        <main className={isSidebarExpanded ? 'main-expanded' : 'main-collapsed'}>
        </main>

          <div
              style={{
                  textAlign: "center",
                  width: "140%",
                  alignItems: "center",
                  padding: "30px",
                  fontFamily: "Arial, sans-serif",
                  marginTop: "20px",
                  marginLeft: "-5 px"
              }}>
              <h2
                  style={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '30px',
                      padding: '15px',
                      width:"120%",
                      fontStyle: 'oblique',
                      backgroundColor: 'teal',
                      borderRadius: '10px',
                  }}
              >
                  Accepted Candidates
              </h2>
              {/* Search Input */}
              <div className="search mb-3">
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or resume..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{marginLeft:"15%"}}
                  />
              </div>

              {/* Table */}
              <div className="table-responsive" style={{width: '120%' ,}}>
                  <table className=" table-hover table-striped table-bordered table-hover ">
                      <colgroup>
                          <col style={{width: '15%'}}/>
                          <col style={{width: '10%'}}/>
                          <col style={{width: '15%'}}/>
                          <col style={{width: '10%'}}/>
                          <col style={{width: '10%'}}/>
                      </colgroup>
                      <thead style={{fontWeight: 'bold', color: 'black', fontSize: "20px"}}>
                      <tr style={{ height: '50px', backgroundColor: '#E0F2F1' }}>
                          <th> Name</th>
                          <th> Email</th>
                          <th> JD</th>
                          <th> Percentage</th>
                          <th> Actions</th>
                      </tr>
                      </thead>
                      <tbody style={{alignItems: "center"}}>
                      {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification) => (
                              <tr key={notification._id}>
                                  <td style={{color: "black"}}>{notification.personal_info ? notification.personal_info[0]?.name : 'N/A'}</td>
                                  <td>
                                      {notification.personal_info ? (
                                          <a href={`mailto:${notification.personal_info[0]?.email}`}>
                                              {notification.personal_info[0]?.email}
                                          </a>
                                      ) : 'N/A'}
                                  </td>
                                  <td>
                                      <a
                                          href="#"
                                          onClick={() => viewJob(notification.job_id)}
                                      >
                                          {notification.job_title}
                                      </a>
                                  </td>
                                  <td style={{color: "black"}}>{notification.match_percentage}%</td>
                                  <td>
                                      <button
                                          className="btn w-50"
                                          onClick={() => openModal(notification)}
                                      >
                                         <FaEye size={20}   style={{ marginRight: '5px', color: 'teal' }}/>
                                      </button>
                                      <button
                                          className="btn w-50 "
                                          onClick={() => handleEmailClick(notification.personal_info[0]?.email, notification._id)}
                                      >
                                         <FaEnvelope size={20} style={{ marginRight: '5px', color: 'teal' }} />
                                      </button>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan="5" className="text-center">
                                  No data found
                              </td>
                          </tr>
                      )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Modal Component */}
          <Modal isOpen={isModalOpen} closeModal={closeModal} candidate={selectedCandidate}/>
      </div>
  );
}

export default Candidatee;
