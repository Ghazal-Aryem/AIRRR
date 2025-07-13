import React, { useState } from "react";
import "./banner.css";

const Banner = () => {
  const slides = [
    {
      title: "Tailored Recommendations Just for You!",
      content:
        "Our system analyzes your career goals, skills, and experience to provide personalized suggestions that align with your aspirations. Whether you're a fresh graduate or an experienced professional, we ensure your resume stands out to hiring managers in your industry.",
    },
    {
      title: "Get Instant, Actionable Feedback!",
      content:
        "No more waiting for days to get feedback! Our AI-powered tool gives you real-time insights on how to improve your resume, helping you make immediate changes and optimize your resume for success.",
    },
    {
      title: "Transform Your Resume with Actionable Insights",
      content:
        "Get detailed, data-driven feedback that highlights key areas for improvement. From keyword optimization to layout suggestions, our system provides specific actions you can take to make your resume more impactful and increase your chances of getting noticed.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className="banner" >
      <div className="carousel">
        <div className="carousel-slide">
          <h1>{slides[currentIndex].title}</h1>
          <p>{slides[currentIndex].content}</p>
        </div>
        <button className="carousel-btn prev" onClick={goToPrevSlide} style={{ marginLeft: "auto" ,backgroundColor:"white" ,color:"teal"}}>
          &#10094; {/* Left Arrow */}
        </button>
        <button className="carousel-btn next" onClick={goToNextSlide} style={{ marginLeft: "auto" ,backgroundColor:"white",color:"teal"}}>
          &#10095; {/* Right Arrow */}
        </button>
      </div>
      <div className="carousel-indicators" >
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Banner;
