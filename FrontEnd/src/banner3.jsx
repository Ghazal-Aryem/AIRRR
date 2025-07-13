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

          }}>Why Choose AI-Enabled Resume Recommendation System?</h3>


      <div className="checklist-container " style={{marginTop:"5%"}}>
        {/* Format Section */}
        <div className="checklist-card">

          <h3>Accuracy:</h3>
          <ul>
            <li>✅ A deep analysis of your resume.</li>
            <li>✅ A precise match with job descriptions.</li>
            <li>✅ Match score is a true reflection of your qualifications.</li>
          </ul>
        </div>

        {/* Resume Sections */}
        <div className="checklist-card">
          <h3>Efficiency</h3>
          <ul>
            <li>✅ Eliminate guesswork</li>
              <li>✅ Quickly enhance your chances of success</li>
            <li>✅ Receive instant feedback </li>
            <li>✅ Save time and effort </li>
          </ul>
        </div>

        {/* Content Section */}
        <div className="checklist-card">

          <h3>Improved Opportunities:</h3>
          <ul>
            <li>✅ Increases your visibility to recruiters.


</li>
            <li>✅ Stand out in the competitive job market with an optimized resume.</li>
            <li>✅ Improve chances of securing interviews and job offers.</li>
          </ul>
        </div>

        {/* Style Section */}
        <div className="checklist-card">

          <h3>Empowerment:</h3>
          <ul>
            <li>✅
              Our AI doesn’t just give you a score; it empowers you with actionable insights.</li>
            <li>✅ Gain the knowledge needed to improve your resume.</li>
            <li>✅ Turn each feedback into an opportunity for growth.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeChecklist;
