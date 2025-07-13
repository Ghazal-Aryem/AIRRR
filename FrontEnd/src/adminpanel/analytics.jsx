import React, { useState } from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Sidebar from "./sidebar.jsx";
ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [resumeText, setResumeText] = useState(""); // Store resume text
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Category Distribution",
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  }); // Pie chart data

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  // Function to handle file upload change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeText(file); // Store the file for upload
    }
  };

  // Function to handle form submission and call the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText) {
      console.error("Please upload a resume.");
      return;
    }

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('resume', resumeText);

      // Send the file to the API
      const response = await fetch('http://127.0.0.1:8080/api/category_predict/predict-category', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData, // Send the form data with the file
      });

     if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
}


      // Parse the JSON response
      const data = await response.json();
      console.log(data); // Log to check if the structure is correct

      if (Array.isArray(data)) {
        const labels = data.map(item => item.category);
        const probabilities = data.map(item => item.probability);

        // Update the chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Category Distribution",
              data: probabilities,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
            },
          ],
        });
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
      <div className="grid-container">
          <Sidebar
              isSidebarExpanded={isSidebarExpanded}
              toggleSidebar={toggleSidebar}
          />
          <main className={isSidebarExpanded ? 'main-expanded' : 'main-collapsed'}>

              {/* File input form */}

          </main>

          <div
              style={{
                  textAlign: "center",
                  width: "140%",
                  alignItems: "center",
                  padding: "30px",
                  fontFamily: "Arial, sans-serif",
                  marginTop: "20px",
                  marginLeft: "-5 px"
              }}>
              <h2
                  style={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: '30px',
                      padding: '15px',

                      fontStyle: 'oblique',
                      backgroundColor: 'teal',
                      borderRadius: '10px',
                  }}
              >
                  Predict Category
              </h2>
              <form onSubmit={handleSubmit}>
                  <input
                      type="file"
                      accept=".txt,.docx , .pdf" // Adjust as per file types you want to support
                      onChange={handleFileChange}
                      style={{display: "flex", borderRadius: "5px"}}
                  />
                  <button type="submit" disabled={!resumeText} style={{
                      backgroundColor: "#189B9B"
                      , borderRadius: "5px", color: "white", border: "none",padding: "10px 20px",
                          cursor: "pointer",
                  }}>Submit Resume
                  </button>

                  {/* Disable if no file is selected */}
              </form>
              <div style={{width: "550px", marginLeft:"15%", marginTop: "10%"}}>

                  <Pie data={chartData}/>
              </div>
          </div>


      </div>
  );
}

export default Analytics;