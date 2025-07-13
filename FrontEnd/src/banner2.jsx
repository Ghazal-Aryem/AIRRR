// Banner.js
import React from 'react';
import "./banner.css"

const Banner2 = () => {
  return (
      <div className="banner" style={{
         backgroundColor:"#E0F2F1",
          color: "black",
          textAlign: "center",
          padding: "20px",
          fontFamily: "arial, sans-serif",
      }}>
          <h3 style={{
              margin: "0",
              fontSize: "2.5rem",
              fontWeight: "bold",
              fontFamily: "arial, sans-serif",marginTop:"20px",
              color: "teal"

          }}>Features</h3>
          <p style={{
              marginTop: "20px",
              padding: "30px",
              marginLeft: "30px",
              marginRight: "30px",
              fontSize: "1.2rem"

          }}>
              <p> we leverage the power of AI to help you land your dream job by matching your resume to the most relevant job descriptions.</p>
              <ul style={{listStyleType: "none", padding: "30px"}}>
                  <li>
                      Real-Time Resume Evaluation: See the match percentage immediately after uploading your resume. Job
                  </li>
                  <li>
                      User-Friendly Interface: With a simple and intuitive interface, it’s easy to upload, track, and improve your resume.</li>
                  <li>
                      AI-Powered Insights: Receive feedback on your resume’s alignment with job requirements.
                  </li>
                  <li>
                      Description Database: We provide a wide range of job descriptions for various industries and roles.
                  </li>

              </ul>





          </p>

      </div>


  );
};

export default Banner2;
