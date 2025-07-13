import React, { useState } from "react";
import Sidebar from "./sidebar";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Extraction() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [resumes, setResumes] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState(null);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  const getCardColor = (key) => {
  switch(key) {
    case 'Skills':
      return '#4CAF50'; // Green
    case 'Experience':
      return '#2196F3'; // Blue
    case 'Education':
      return '#FF9800'; // Orange
    case 'Certifications':
      return '#9C27B0'; // Purple
    default:
      return '#607D8B'; // Default gray
  }
};

  const handleResumeUpload = (event) => {
    setResumes(event.target.files);
    setError(false); // Reset error if files are selected
    setSuccess(false); // Reset success
    setResponse(null); // Clear previous response
  };

  const handleUpload = async () => {
    if (!resumes) {
      setError(true); // Show the error message
      setSuccess(false); // Reset success
      return;
    }

    try {
      const formData = new FormData();
      for (let i = 0; i < resumes.length; i++) {
        formData.append("resume", resumes[i]);
      }

      const response = await fetch(
        "http://127.0.0.1:8080/api/extract_resume_infor/extract-info",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      setResponse(result);
      setSuccess(true);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setSuccess(false);
    }
  };

  const renderEntitySection = (title, entities) => (
    <div className="card mb-3">
      <div className="card-header">
        <h5>{title}</h5>
      </div>
      <div className="card-body">
        {entities && entities.length > 0 ? (
          <div className="row">
            {entities.map((item, index) => (
              <div className="col-md-4" key={index}>
                <span className="badge bg-primary text-wrap">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );

  return (
      <div className="grid-container">
          <Sidebar
              isSidebarExpanded={isSidebarExpanded}
              toggleSidebar={toggleSidebar}
          />
          <main className={isSidebarExpanded ? 'main-expanded' : 'main-collapsed'}>
          </main>
          <div
              style={{textAlign: "center",
                  width:"130%",
                  alignItems: "center",
                  padding: "30px",
                  fontFamily: "Arial, sans-serif",
                  marginTop: "10px" ,
              marginLeft:"10px"}}>



                  <h2
                      style={{
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "30px",
                          padding: "20px",
                          fontStyle: "oblique",
                          backgroundColor: "teal",
                          borderRadius: "10px",
                      }}
                  >
                      Extract the Skills
                  </h2>

                  <div
                      style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "20px",
                          marginTop: "30px",
                      }}
                  >
                      <div
                          style={{
                              border: "2px dashed teal",
                              borderRadius: "10px",
                              padding: "20px",
                              width: "500px",
                              height: "100px",
                              textAlign: "center",
                          }}
                      >
                          <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeUpload}
                              style={{display: "none"}}
                              id="resume-upload"
                          />
                          <label
                              htmlFor="resume-upload"
                              style={{cursor: "pointer", color: "black"}}
                          >
                              <span className="icon" style={{color:"teal"}}>+</span>
                              <div>Upload Resumes</div>
                          </label>
                      </div>
                  </div>

                  {/* Show uploaded file names */}
                  {resumes && (
                      <div style={{border: "2px dashed teal",
                              margin: "20px",
                              marginLeft:"29%",
                              borderRadius: "10px",
                              padding: "20px",
                              width: "300px",
                              height: "100px",
                              textAlign: "center",}} >
                          <h5 style={{color:"#189B9B" ,marginTop:"20px"}}>Uploaded Files:</h5>
                          <ul style={{color:"#189B9B" , textAlign:"center" , listStyleType: "none"}}>
                              {Array.from(resumes).map((file, index) => (
                                  <li  key={index}>{file.name}</li>
                              ))}
                          </ul>
                      </div>
                  )}

                  <button
                      onClick={handleUpload}
                      style={{
                          backgroundColor: "#189B9B",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "10px 20px",
                          cursor: "pointer",
                          marginTop: "40px",
                      }}
                  >
                      Upload Resume
                  </button>



                  {/* Error message */}
                  {error && (
                      <div
                          className="alert alert-danger mt-3"
                          style={{marginTop: "15px", color: "red"}}
                      >
                          <p>ALERT! Please upload a valid resume.</p>
                      </div>
                  )}

                  {/* Success message */}
                  {success && response && (
                      <div
                          className="alert alert-info mt-3 w-100"
                          style={{
                              marginTop: "15px",
                              color: "black",
                              textAlign: "left",
                              maxWidth: "800px",
                              margin: "auto",
                              padding: "10px",
                          }}
                      >
                          <h4  style={{textAlign:"center" ,backgroundColor:"189B9B" ,color:"black" ,
                              fontSize:"30px" ,fontWeight:"bolder"}}>Extracted Information</h4>
                          <div>
                              <h5 style={{textAlign:"center"}}>
                                  <b>Resume Name:</b> {response.resumeName}
                              </h5>
{Object.entries(response.entities).map(([key, value]) => (
    <div style={{ color:"black" }} key={key}>
        <h4 style={{fontSize:"20px" ,fontWeight:"bolder"}}>{key}</h4>
        <ul>
            {value.map((item, index) => (
                <li key={index} style={{color:"black"}}>{item}</li>
            ))}
        </ul>
    </div>
))}



                          </div>
                      </div>
                  )}
              </div>

          </div>
          );
          }

          export default Extraction;
