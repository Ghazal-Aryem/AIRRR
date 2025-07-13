import React, { useRef ,useState} from "react";
import First from "./first";
import "./first.css"; // CSS file for styling
import jobImage from './assets/image.png'; // Importing the image
import { Link } from "react-router-dom";
import Banner from './banner';
import Banner2 from './banner2';
import Banner3 from './banner3';
import Banner4 from './banner4';
import Footer from "./Footer";
import {  toast } from 'react-toastify';

    function App() {

        const bannerRef = useRef(null);

        const handleSubmit = (e) => {
            e.preventDefault();
            toast.warning(" Please Log In! :)");
        };

        const scrollToBanner = () => {
            bannerRef.current?.scrollIntoView({behavior: "smooth"});
        };

        return (
            <div style={{backgroundColor:"#FAFAFA"}}>
                <First/>

                <div className="resume-match-container">
                    {/* Left Section */}
                    <div className="text-section" style={{marginTop: "10%"}}>
                        <h1>Compare Your Resume to a Job Description</h1>
                        <p>
                            The Resume Job  Description Match tool allows you to quickly compare
                            your existing resume to the job description of any role. Get an
                            instant match score with a breakdown of how well your resume aligns
                            with the language, keywords, and skills from the job. See how your
                            resume stacks up to any job.
                        </p>
                        <Link to="/register">
                            <button className="compare-button" onClick={handleSubmit}>
                                Compare Your Resume to a Job
                            </button>
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="card-section" style={{marginTop: "10%"}}>
                        {/* Image in the right card */}
                        <div className="card-image">
                            <img src={jobImage} alt="Job description"/>
                        </div>
                    </div>

                </div>

                {/* Banner Section */}
                <div ref={bannerRef}>
                    <Banner4/>
                    <Banner/>
                    <Banner2/>
                     <Banner3/>
                </div>

<Footer/>
            </div>
        );

}
export default App;
