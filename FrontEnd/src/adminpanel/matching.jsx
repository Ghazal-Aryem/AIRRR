import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';

function Matching() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [resumes, setResumes] = useState([]); // Store actual file objects for resumes
    const [jobDescription, setJobDescription] = useState(null); // Store the job description file object
    const [matchingPercentages, setMatchingPercentages] = useState([]);
    const [resumeNames, setResumeNames] = useState([]);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resumeProgress, setResumeProgress] = useState([]); // Progress for each resume file
    const [jobDescriptionProgress, setJobDescriptionProgress] = useState(0); // Progress for job description
    const { setValue } = useForm();
    const [showModal, setShowModal] = useState(false);
    const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

    const handleResumeUpload = (event) => {
        const files = Array.from(event.target.files);
        setResumes(files); // Store file objects
        setResumeProgress(new Array(files.length).fill(0)); // Initialize progress for each file
        setError(false);
        setSuccess(false);
    };

   const handleJobDescriptionUpload = (event) => {
    const file = event.target.files[0]; // Get the actual file object
    if (file) {
        setJobDescription(file); // Store the file object in state
        setJobDescriptionProgress(0); // Reset the progress bar
    }
    setError(false);
    setSuccess(false);
};


   const handleUpload = async () => {
    if (resumes.length === 0 || !jobDescription) {
        setError(true);
        setSuccess(false);
        return;
    }

    const formData = new FormData();

    // Append resume files
    resumes.forEach((file) => formData.append('resumes', file));

    // Append the actual job description file
    formData.append('jobDescription', jobDescription);

    try {
        const response = await axios.post('http://localhost:8080/api/admin/matchs',
            formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                if (total) {
                    const progress = Math.round((loaded / total) * 100);
                    setResumeProgress((prevProgress) => prevProgress.map(() => progress)); // Update resume progress
                    setJobDescriptionProgress(progress); // Update job description progress
                }
            },
        });

        setMatchingPercentages(response.data.matchingPercentages);
        setResumeNames(response.data.resumeNames);
        setSuccess(true);
        setError(false);
         setShowModal(true);
    }
    catch (error) {
        console.error('Error uploading files:', error);
        setError(true);
        setSuccess(false);
    }
};


    return (
        <div className="grid-container">
            <Sidebar isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <main className={isSidebarExpanded ? 'main-expanded' : 'main-collapsed'}></main>

            <div
                style={{
                    textAlign: 'center',
                    width: '100%',
                    alignItems: 'center',
                    padding: '30px',
                    fontFamily: 'Arial, sans-serif',
                    marginTop: '10px',
                    marginLeft: '-20px',
                }}
            >
                <h2
                    style={{
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: '30px',
                        padding: '20px',
                        fontStyle: 'oblique',
                        backgroundColor: 'teal',
                        borderRadius: '10px',
                    }}
                >
                    Match the Resume with JD
                </h2>

                <div style={{ display: 'flex', justifyContent: 'start', gap: '10px', marginTop: '50px' }}>
                    {/* Resume Upload Section */}
                    <div
                        style={{
                            border: '2px dashed teal',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '400px',
                            height: '50%',
                            textAlign: 'center'
                        }}
                    >
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            style={{ display: 'none' }}
                            id="resume-upload"
                            multiple
                        />
                        <label htmlFor="resume-upload" style={{ cursor: 'pointer', color: 'black' }}>
                            <span className="iconn" style={{color:"teal"}}>+</span>
                            <div>Upload Resume</div>
                        </label>

                        {resumes.length > 0 &&
                            resumes.map((file, index) => (
                                <div key={index} className="file-card">
                                    <div className="file-info">
                                        <span className="icon1">📄</span>
                                        <h6>{file.name}</h6>
                                        <span
                                            className="close-icon"
                                            onClick={() => {
                                                setResumes((prev) => prev.filter((_, i) => i !== index));
                                                setResumeProgress((prev) => prev.filter((_, i) => i !== index));
                                            }}
                                            style={{ cursor: 'pointer', color: 'teal' }}
                                        >
                                            ✖
                                        </span>
                                    </div>

                                    <div className="progress-bg">
                                        <div
                                            className="progress"
                                            style={{ width: `${resumeProgress[index] || 0}%` }}
                                        ></div>
                                    </div>
                                    <p>{(resumeProgress[index] || 0).toFixed(2)}%</p>
                                </div>
                            ))}
                    </div>

                    {/* Job Description Upload Section */}
                    <div
                        style={{
                            border: '2px dashed teal',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '400px',
                            height: '50%',
                            textAlign: 'center',
                        }}
                    >
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleJobDescriptionUpload}
                            style={{ display: 'none' }}
                            id="job-upload"
                        />
                        <label htmlFor="job-upload" style={{ cursor: 'pointer', color: 'black' }}>
                            <span className="iconn"  style={{color:"teal"}}>+</span>
                            <div>Upload Job Description</div>
                        </label>

                        {jobDescription && (
                            <div className="file-card">
                                <div className="file-info">
                                    <span className="icon1">📄</span>
                                    <h6>{jobDescription.name}</h6>
                                    <span
                                        className="close-icon"
                                        onClick={() => setJobDescription(null)}
                                        style={{ cursor: 'pointer', color: 'teal' }}
                                    >
                                        ✖
                                    </span>
                                </div>

                                <div className="progress-bg">
                                    <div className="progress" style={{ width: `${jobDescriptionProgress}%`}}></div>
                                </div>
                                <p>{jobDescriptionProgress.toFixed(2)}%</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    style={{
                        backgroundColor: 'teal',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginTop: '40px',
                    }}
                >
                    Match Resumes
                </button>

                {error && (
                    <div className="alert alert-danger mt-3" style={{ marginTop: '15px', color: 'red' }}>
                        <p>Please upload both resumes and a job description!</p>
                    </div>
                )}

                {/*{success && (*/}
                {/*    <div className="alert alert-info mt-3">*/}
                {/*        <h4>Matching Results:</h4>*/}
                {/*        <ul style={{listStyleType: 'none'}}>*/}
                {/*            {resumeNames.map((name, index) => (*/}
                {/*                <li key={index}>*/}
                {/*                    {name} - {matchingPercentages[index]}%*/}
                {/*                </li>*/}
                {/*            ))}*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/* Modal to show matching results */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Matching Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resumeNames.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {resumeNames.map((name, index) => (
                                <li key={index}>Matching percentage of <strong> {name}</strong> is : {matchingPercentages[index]}%
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </div>
    );
}

export default Matching;