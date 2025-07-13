import React from "react";
import "./candidateModel.css"; // Add a CSS file for styling
import {toast} from "react-toastify";
const CandidateModal = ({ isOpen, closeModal, candidate }) => {
  if (!isOpen || !candidate) return null;

  // Ensure candidate object structure is correct
  const personalInfo = candidate.personal_info?.[0] || {}; // Access the first object in the array
  const resumeEntities = candidate.resume_entities?.entities || {}; // Accessing the entities directly
  const matchPercentage = candidate.match_percentage?.[0] || "0";
  const timestamp = candidate.timestamp ? new Date(candidate.timestamp).toLocaleString() : "N/A";
  const jobTitle = candidate.job_title || "N/A";
  const resumeName = candidate.resume_name || "N/A";
  const predicted  = candidate.Predicted_category || "N/A";
  // Combine the label and text from both personalInfo and resumeEntities into a single list
  const combinedEntities = [
    ...Object.entries(personalInfo).map(([label, text]) => ({
      label,
      text,
    })),
    ...Object.entries(resumeEntities).map(([label, texts]) => ({
      label,
      text: Array.isArray(texts) ? texts.join(", ") : texts,
    })),
  ];

  // Group entities by label
  const groupedEntities = combinedEntities.reduce((acc, { label, text }) => {
    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(text);
    return acc;
  }, {});
const viewResume = async (resumeId) => {
    try {
        console.log('Resume ID:', resumeId); // Debugging line
        const response = await fetch(`http://localhost:8080/api/resumes/View_resume/${resumeId}`);

        if (!response.ok) {
            console.error(`Failed to fetch resume for ID: ${resumeId}`);
            alert(`Failed to fetch resume details. HTTP Status: ${response.status}`);
            return;
        }

        const resumeData = await response.json();

        if (resumeData.link) {
            // Open the resume file link in a new tab
            window.open(resumeData.link, '_blank');
        } else {
            toast.error("Resume file link is not available.");
        }
    } catch (error) {
        console.error('Error fetching resume:', error);
        toast.error("An error occurred while fetching the resume. Please try again later.");
    }
};

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-button" onClick={closeModal} style={{color:"white"}}>
          &times;
        </button>
        <h2 className="modal-header">Candidate Details</h2>

          <div className="modal-body">
              {/*/!* Personal Info Section *!/*/}
              {/*{Object.keys(personalInfo).length > 0 && (*/}
              {/*  <div className="modal-section">*/}
              {/*    <h3 className="section-header">Personal Information:</h3>*/}
              {/*    <ul className="entity-list">*/}
              {/*      {Object.entries(personalInfo).map(([label, text], index) => (*/}
              {/*        <li key={index} className="entity-item">*/}
              {/*          <strong>{label || "Unknown"}:</strong>*/}
              {/*          <p>{text || "N/A"}</p>*/}
              {/*        </li>*/}
              {/*      ))}*/}
              {/*    </ul>*/}
              {/*  </div>*/}
              {/*)}*/}

              {/* Resume Information */}
              {Object.keys(groupedEntities).length > 0 && (
                  <div className="modal-section">
                      <h3 className="section-header">Resume Details:</h3>
                      <ul className="entity-list">
                          {Object.entries(groupedEntities).map(([label, texts], index) => (
                              <li key={index} className="entity-item">
                                  <strong>{label || "Unknown"}:</strong>
                                  <ul>
                                      {texts.map((text, textIndex) => (
                                          <li key={textIndex}>{text || "N/A"}</li>
                                      ))}
                                  </ul>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}

              {/* Match Percentage */}
              <div className="modal-section">
                  <label>Match Percentage:</label>
                  <p>{matchPercentage}%</p>
              </div>
              {/*Category*/}
              <div className="modal-section">
                  <label>Predicted Category:</label>
                  <p>{predicted}</p>
              </div>
              {/* Job Title */}
              <div className="modal-section">
                  <label>Job Title:</label>
                  <p>{jobTitle}</p>
              </div>

              {/* Resume Name */}
              <div className="modal-section">
                  <label>Resume Name:</label>
                  <p>{resumeName}</p>
              </div>

              {/* Timestamp */}
              <div className="modal-section">
                  <label>Timestamp:</label>
                  <p>{timestamp}</p>
              </div>
          </div>

          {/* Footer with View Resume and Close Buttons */}
          <div className="modal-footer">
              <button
                  className="view-resume-button"
            onClick={() => viewResume(candidate.resume_id)} // Call viewResume with resume_id
          >
            View Resume
          </button>
          <button className="close-modal-button" onClick={closeModal}>
            Close
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default CandidateModal;
