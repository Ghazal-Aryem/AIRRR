import React from 'react';
import './banner.css'; // Add the styling here

const ResumeChecklist = () => {
  return (
    <div className="resume-checklist">
      <h3 style={{
              margin: "0",
              fontSize: "2.5rem",
              fontWeight: "bold",
              fontFamily: "arial, sans-serif",marginTop:"20px",
              color: "black"

          }}>How It Works: A Simple 3-Step Process</h3>


        <div className="checklist-container " style={{marginTop: "5%"}}>
            {/* Format Section */}
            <div className="checklist-card">

                <h5 style={{fontWeight: "bold"}}>Upload Resume</h5>
                <ul style={{marginTop: "15%"}}>
                    <li>➡️ Upload resume in any standard format (PDF, DOCX).</li>
                    <li>️➡️ ️Our system will securely process it</li>
                    <li>➡️ Extracting key information like skills, work experience, and qualifications.</li>
                </ul>
                <ul>

                </ul>
            </div>


            <div className="checklist-card">

                <h5 style={{fontWeight: "bold"}}>Resume Match</h5>
                <ul style={{marginTop: "15%"}}>
                    <li>➡️ AI system uses algorithms to compare your resume with a job description.</li>
                    <li>️➡️ ️evaluates key factors such as skills, experience, and relevant keywords to generate a match
                        score.
                    </li>

                </ul>
                <ul>

                </ul>
            </div>


            <div className="checklist-card">

                <h5 style={{fontWeight: "bold"}}>Get Your Resume Score</h5>
                <ul style={{marginTop: "15%"}}>
                    <li>➡️ You’ll instantly receive a match percentage.</li>
                    <li>️➡️ ️You’ll also get suggestions on what to tweak for a better match!
                    </li>

                </ul>
                <ul>

                </ul>
            </div>


        </div>
    </div>
  );
};

export default ResumeChecklist;
