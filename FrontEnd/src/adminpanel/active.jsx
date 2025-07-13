import React, { useState, useEffect  } from "react";
import Sidebar from "./sidebar.jsx";
import "./App.css"
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
const active_job = () => {

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);


  const [jobTitle, setJobTitle] = useState("");
  const [expireDate, setExpireDate] = useState(""); // State for expiration date
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null); // State for editing a job
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
// Fetch active jobs from the backend
  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/jobs/get-active-jobs"); // Fetch active jobs
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);
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
            toast.error("Job file link is not available.");
        }
    } catch (error) {
        console.error('Error fetching job description:', error);
        toast.error("An error occurred while fetching the job details. Please try again later.");
    }
};
 const handleDelete = async (jobId) => {
    const confirmation = window.confirm("Are you sure you want to delete this job?");
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:8080/api/jobs/delete-job/${jobId}`, {
          method: "DELETE",
        });
        const result = await response.json();
        toast.success(result.message);
        fetchJobs(); // Refresh the job list after deletion
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Failed to delete job");
      }
    }
  };
const handleUpload = async (e) => {
    e.preventDefault();

    // Ensure expireDate is formatted correctly
    // Ensure expireDate is formatted correctly
    const formattedExpireDate = expireDate
        ? new Date(expireDate).toISOString() // Convert the string to a Date object and then to ISO format
        : "";// Convert to ISO format if a date is selected

    const formData = new FormData();
    formData.append("job_title", jobTitle);
    formData.append("expire_date", formattedExpireDate);
    formData.append("file", file);

    const url = `http://localhost:8080/api/jobs/update-job/${editingJob._id}` ;
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();
      toast.success(result.message);
      fetchJobs(); // Refresh job list
       // Reset form after submission
      setShowModal(false); // Close the modal after submission
    } catch (error) {
      console.error("Error uploading job:", error);
      toast.error("Failed to Udate job");
    }
  };
 // Separate function to handle job editing
  const handleEditJob = (job) => {
    setJobTitle(job.job_title);
    setExpireDate(job.expire_date.split("T")[0]); // Set expire date as a Date object
    setFile(null); // Optionally, handle file upload if needed
    setEditingJob(job); // Set the job as the current job to edit
    setShowModal(true); // Open the modal
  };

  // Close the modal
  const handleCloseModal = () => setShowModal(false);

  return(
      <div className="grid-container" style={{
          flexDirection: "row",
          display: "flex", position: "fixed", width: "100%", overflowY: "scroll"}}>
          <Sidebar
              isSidebarExpanded={isSidebarExpanded}
              toggleSidebar={toggleSidebar}
          />
          <main className={isSidebarExpanded ? 'main-expanded' : 'main-collapsed'}>
          </main>


          <div style={{margin: "50px auto", maxWidth: "70%" ,marginLeft:"5px"}}>

              <h2
                  style={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "30px",
                      padding: "20px",
                      fontStyle: "oblique",
                      backgroundColor: "teal",
                      borderRadius: "10px",textAlign: "center"
                  }}
              >
                  JOB DESCRIPTIONS
              </h2>
              <div
                  style={{
                      display: "flex",
                      overflowX: "scroll",
                      gap: "20px",
                      padding: "10px",
                      scrollbarWidth: "none", // Hide scrollbar for modern browsers

                  }}
                  className="carousel-container"
              >
                  {jobs.map((job, index) => (
                      <div
                          key={index}
                          style={{
                              minWidth: "300px",
                              flex: "0 0 auto",
                              backgroundColor: "#f9f9f9",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              padding: "20px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                          }}
                      >
                          <h3 style={{fontSize: "18px", fontWeight: "bold"}}>{job.job_title}</h3>
                          <p style={{fontSize: "14px", color: "#555"}}>
                              <strong>Expires on:</strong>{" "}
                              {new Date(job.expire_date).toLocaleString()}
                          </p>
                          <a
                              href="#"
                              onClick={() => viewJob(job._id)}

                              rel="noopener noreferrer"
                              style={{
                                  textDecoration: "none",
                                  color: "#007bff",
                                  marginBottom: "15px",
                              }}
                          >
                              View Job Description
                          </a>
                          <div style={{display: "flex", justifyContent: "space-between"}}>
                              <button
                                  style={{
                                      backgroundColor: "#ffc107",
                                      border: "none",
                                      padding: "10px 20px",
                                      borderRadius: "5px",
                                      color: "#fff",
                                      cursor: "pointer",
                                  }}
                                  onClick={() => handleEditJob(job)}
                              >
                                  Edit
                              </button>
                              <button
                                  style={{
                                      backgroundColor: "#dc3545",
                                      border: "none",
                                      padding: "10px 20px",
                                      borderRadius: "5px",
                                      color: "#fff",
                                      cursor: "pointer",
                                  }}
                                   onClick={() => handleDelete(job._id)}
                              >
                                  Delete
                              </button>
                          </div>
                      </div>
                  ))}

              </div>
              <div style={{position: "relative", margin: "50px auto", maxWidth: "90%"}}>
                  <button
                      style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "teal",
                          border: "1px solid #ccc",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                          zIndex: 10,
                          color:"white"
                      }}
                      onClick={() => {
                          document.querySelector(".carousel-container").scrollBy({
                              left: -300,
                              behavior: "smooth",
                          });
                      }}
                  >
                      &lt;
                  </button>
                  <button
                      style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "teal",
                          border: "1px solid #ccc",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                          zIndex: 10,
                          color:"white"
                      }}
                      onClick={() => {
                          document.querySelector(".carousel-container").scrollBy({
                              left: 300,
                              behavior: "smooth",
                          });
                      }}
                  >
                      &gt;
                  </button>
              </div>
          </div>


          <div style={{
              marginTop: "20px", flexDirection: "row",
              display: "flex", flexWrap: "wrap", justifyContent: "center",
              width: "50%", position: "fixed", marginLeft: "30%", overflowY: "auto"
          }}>


          </div>

      {/* Edit Job Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <label className="form-label">Job Title:</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Expiration Date:</label>
                <input
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    placeholder="2024-12-31"
                    className="form-control"
                />
            </div>
              <div className="mb-3">
                  <label className="form-label">Upload JD (PDF/docx/txt):</label>
                  <input
                      type="file"

                      onChange={(e) => setFile(e.target.files[0])}
                className="form-control"
              />
            </div>
            <Button type="submit" className="btn btn-primary w-100">
              Update
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      </div>
  );
};

export default active_job;