import React, { useState, useEffect  } from "react";
import Sidebar from './sidebar';
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
const job_post = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);


  const [jobTitle, setJobTitle] = useState("");
  const [expireDate, setExpireDate] = useState(""); // State for expiration date
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null); // State for editing a job

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

  const handleUpload = async (e) => {
  e.preventDefault(); // Prevent form's default submission behavior
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("expire_date", expireDate); // Add expiration date to the form
  formData.append("file", file);

  // Always use the POST method for uploading jobs
  const url = "http://localhost:8080/api/jobs/upload"; // Endpoint for creating a job

  try {
    const response = await fetch(url, {
      method: "POST", // Use POST for all uploads
      body: formData,
    });
    const result = await response.json();
    toast.success(result.message);
    fetchJobs(); // Refresh the job list
    resetForm(); // Reset the form
  } catch (error) {
    console.error("Error uploading job:", error);
    alert("Failed to upload job");
  }
};

// Reset form for creating a job
const resetForm = () => {
  setJobTitle("");
  setExpireDate("");
  setFile(null);
};


  return(

      <div className="grid-container ">
        <Sidebar
            isSidebarExpanded={isSidebarExpanded}
            toggleSidebar={toggleSidebar}
        />
        <main className={isSidebarExpanded ? 'main-expanded' : 'main-collapsed'}>
        </main>

        <div
            style={{
              textAlign: "center",
              width: "220%",
              alignItems: "center",
              padding: "30px",
              fontFamily: "Arial, sans-serif"
            }}>
          <h2
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: "30px",
                padding: "20px",
                fontStyle: "oblique",
                backgroundColor: "teal",
                borderRadius: "10px", textAlign: "center", marginBottom: "20px",

              }}
          >
            Admin: Manage Job Descriptions
          </h2>

          {/* Job Upload Form */}
          <form onSubmit={handleUpload} className="border p-4 rounded shadow-sm mb-5 text-dark">
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
              <label className="form-label">Expiration Date (ISO 8601, e.g., 2024-12-31):</label>
              <input
                  type="date"
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  placeholder="2024-12-31"
                  className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Upload JD (.PDF , .docx , .txt):</label>
              <input
                  type="file"

                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-success w-25">
              {editingJob ? "Update" : "Upload"}
            </button>
          </form>

          <Link to="/active" className="btn w-100 " style={{borderRadius: "8px" , backgroundColor:"#189B9B"}}>
           View Active jobs
          </Link>

        </div>

      </div>
  );
};

export default job_post