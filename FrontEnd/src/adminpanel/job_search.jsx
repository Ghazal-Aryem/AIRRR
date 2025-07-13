import React, { useState, useEffect, useCallback } from 'react';
import GaugeChart from 'react-gauge-chart';
import Slider from "react-slick";
import "./JobCarousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img from "./img4.jpg";
import { toast } from 'react-toastify';

const JOB_Search = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [matchingPercentage, setMatchingPercentage] = useState(0);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/jobs/job_descriptions?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setJobs(data.job_descriptions);
    } catch (error) {
      console.error('Error fetching job descriptions:', error);
    }
  }, [searchTerm]);

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const applyJob = async (jobId) => {
    if (!resumeFile) {
      toast.warning('Please upload a resume first!');
      return;
    }
     toast.info("ChiLL BRO we are show result in time :)")
    const formData = new FormData();
    formData.append('resumes', resumeFile);
    formData.append('jobDescriptionId', jobId);

    try {
      const response = await fetch('http://localhost:8080/api/candidate_selection/matchs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMatchingPercentage(data.matchingPercentages[0] / 100); // Convert to decimal for GaugeChart
        setShowModal(true);
      } else {
        console.error('Error:', data.detail);
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while applying. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMatchingPercentage(0);
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
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
       const trackPageView = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/metrics/page_views', {
          method: 'POST',
        });

        if (!response.ok) {
          console.error('Failed to track page view');
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    trackPageView();
    fetchJobs();
  }, [fetchJobs]);


  const settings = {
        dots: true,
        infinite: true,
        speed: 200,
        slidesToShow: 3,
        slidesToScroll: 1,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

  return (


      <div
      style={{width:"100%"   ,padding:"10%",
            backgroundImage: `url(${img})`,  // Correct way to apply the background image
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}>

          <div>
              <h2
                  style={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "45px",
                      padding: "20px",
                      fontStyle: "oblique",
                      borderRadius: "10px",
                      marginLeft: "15%"
                  }}
              >
                  Match Your Resumes With Our JD
              </h2>
              <h1 className="text-center mb-4 text-dark"></h1>
              <div className="form-group" style={{marginTop: "50px", marginLeft: "25%"}}>
                  <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="form-control"
                      placeholder="Search job descriptions..."
                      style={{width: "70%"}}
                  />
              </div>
              <div id="job-list" style={{width: "80%", margin: "0 auto" }}>
                  {jobs.length > 0 ? (
                      <Slider {...settings} >
                          {jobs.map((job) => (
                              <div key={job._id} className="card m-5 "  >
                                  <div className="card-body"  >
                                      <h5>
                                          <a
                                              href="#"
                                              onClick={() => viewJob(job._id)}
                                              style={{textDecoration: "none", color: "#007bff" ,fontSize:"15px"}}
                                          >
                                              {job.job_title}
                                          </a>
                                      </h5>
                                      <div className="d-flex flex-column align-items-start">
                                          <input
                                              type="file"
                                              id="resume"
                                              onChange={handleResumeChange}
                                              className="btn btn-sm btn-outline-secondary mb-2"
                                          />
                                          <button
                                              className="btn  btn-sm" style={{backgroundColor:"teal" ,color:"white" }}
                                              onClick={() => applyJob(job._id)}
                                          >
                                              Apply
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </Slider>
                  ) : (
                      <p>No job descriptions found.</p>
                  )}
              </div>

          </div>
          {/* Modal */}
          {showModal && (
              <div className="modal d-block" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                  <div className="modal-dialog">
                      <div className="modal-content">
                          <div className="modal-header justify-content-around">
                              <h5 className="modal-title">Matching Percentage</h5>
                              <button type="button" className="btn btn-outline-danger btn-lg" onClick={closeModal}>
                                  <span>&times;</span>
                              </button>
                          </div>
                          <div className="modal-body text-center">
                              <GaugeChart
                                  id="matching-percentage-chart"
                                  nrOfLevels={10}
                                  percent={matchingPercentage}
                                  textColor="#000"

                              />
                              <p className="mt-3">
                                  Matching Percentage: {(matchingPercentage * 100).toFixed(2)}%
                              </p>

                              {/* Message based on matching percentage */}
                              {matchingPercentage * 100 > 70 && (
                                  <p className="text-success font-weight-bold">Congratulations! You are accepted And your resume is send to HR.</p>
                              )}
                              {matchingPercentage * 100 <= 70 && matchingPercentage * 100 > 50 && (
                                  <p className="text-warning font-weight-bold">Great chance, but you need to improve
                                      your profile.Better luck next time.</p>
                              )}
                              {matchingPercentage * 100 <= 50 && (
                                  <p className="text-danger font-weight-bold">Unfortunately, you are rejected need to improve ;).</p>
                              )}
                          </div>
                          <div className="modal-footer">
                              <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={closeModal}
                              >
                                  Close
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

export default JOB_Search;
