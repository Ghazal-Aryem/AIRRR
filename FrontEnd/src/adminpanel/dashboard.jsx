import React, { useState, useEffect } from "react";
import {  BsPeopleFill } from 'react-icons/bs';
import { FaBookmark,FaAddressCard } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Bar  , Line} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from "chart.js"; // Import Line
import "./dashboard.css";
import Sidebar from "./sidebar";
import axios from "axios";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

function Dashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  const [metrics, setMetrics] = useState({
    user_counts: 0,
    valid_user_count: 0,
    jd_counts: 0,
    resume_counts: 0,
  });
  const [pageViewStats, setPageViewStats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/metrics/metrics")
      .then((response) => setMetrics(response.data))
      .catch((err) => console.error("Error fetching metrics:", err));

    axios.get("http://localhost:8080/api/metrics/stats")
      .then((response) => {
        const formattedStats = response.data.stats.map(stat => ({
          date: stat.date,
          count: stat.count,
        }));
        setPageViewStats(formattedStats);
      })
      .catch((err) => console.error("Error fetching page view stats:", err));
  }, []);

  // Bar chart data
  const chartData = {
    labels: ["Total Users", "Accepted Candidates", "Jobs Posted", "Resumes Uploaded"],
    datasets: [
      {
        label: "Metrics",
        data: [metrics.user_counts, metrics.valid_user_count, metrics.jd_counts, metrics.resume_counts],
        backgroundColor: ["#009688", "#26A69A", "#4DB6AC", "#80CBC4"], // Teal shades
        borderColor: ["#00695C"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Line chart data for page view stats
  const lineChartData = {
    labels: pageViewStats.map((stat) => stat.date), // x-axis labels (dates)
    datasets: [
      {
        label: "Page Views",
        data: pageViewStats.map((stat) => stat.count), // y-axis values (counts)
        borderColor: "#189B9B",
        backgroundColor: "rgba(24, 155, 155, 0.2)",
        fill: true, // Fill under the line
        tension: 0.4, // Smooth curve
        borderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
      <div className="grid-container" style={{
        flexDirection: "row",
        display: "flex",
        position: "fixed",
        width: "100%",
        backgroundColor: "#FAFAFA"
      }}>
        <Sidebar isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar}/>
        <main className={isSidebarExpanded ? "main-expanded" : "main-collapsed"}></main>

        {/* Cards */}
        <div className="main-cards" style={{
          marginTop: "4%",
          flexDirection: "row",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "70%",
          position: "fixed",
          marginLeft: "22%"
        }}>
          <div className="card" style={{backgroundColor: "#E0F2F1"}}>
            <div className="card-inner">
              <h4>TOTAL USERS</h4>
              <BsPeopleFill className="card_icon"/>
            </div>
            <h2>{metrics.user_counts}</h2>
          </div>

          <div className="card" style={{backgroundColor: "#E0F2F1"}}>
            <div className="card-inner">
              <h4>ACCEPTED CANDIDATES</h4>
              <FaBookmark className="card_icon" size={40}/>
            </div>
            <h2>{metrics.valid_user_count}</h2>
          </div>

          <div className="card" style={{backgroundColor: "#E0F2F1"}}>
            <div className="card-inner">
              <h4>JOBS POSTED</h4>
              <MdWork className="card_icon"/>
            </div>
            <h2>{metrics.jd_counts}</h2>
          </div>

          <div className="card" style={{backgroundColor: "#E0F2F1", boxShadow: "rgba(0, 0, 0, 0.1)"}}>
            <div className="card-inner">
              <h4>RESUMES UPLOADED</h4>
              <FaAddressCard className="card_icon" size={40}/>
            </div>
            <h2>{metrics.resume_counts}</h2>
          </div>
        </div>

        <div className="graph-row" style={{
          display: 'flex',
          width: '90%',
          justifyContent: 'space-between',
          margin: '5% auto',
          gap: '5px',
          marginTop: "20%"
        }}>
          {/* Bar chart */}
          <div className="graph-container" style={{width: '45%', height: "100%"}}>
            <Bar data={chartData} options={chartOptions}/>
          </div>
          {/* Line chart */}
          <div className="graph-container" style={{width: '45%'}}>
            <Line data={lineChartData} options={lineChartOptions}/>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;
