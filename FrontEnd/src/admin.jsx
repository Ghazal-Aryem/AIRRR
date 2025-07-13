
import React, { useState, useEffect } from "react";
import axios from "axios";
import Second from "./second"
//import "./first.css"; // CSS file for styling
import { Link } from "react-router-dom";
//import App from "./adminpanel/app";
//import './adminpanel/app.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './adminpanel/header'
import Sidebar from './adminpanel/sidebar'
import Home from './adminpanel/home'

function admin() {
  

   /* const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetch data from the backend API
        axios
          .get("http://localhost:3001/api/employees")  // URL of the API
          .then((response) => {
            setUsers(response.data);  // Set the users data in state
            setLoading(false);  // Stop loading once data is fetched
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
          });
      }, []); // Empty dependency array ensures it runs only once after the component mounts
    
      const handleDelete = (id) => {
        // Delete user logic here (API call to delete from MongoDB)
        setUsers(users.filter((user) => user._id !== id));  // Update the state to remove the user
      };
    
      const handleEdit = (user) => {
        // Handle edit functionality (e.g., open a modal or navigate to an edit page)
        alert(`Edit user: ${user.name}`);
      };*/

  return (

    <div className="admin">  {/* This is the parent element */}
       <div className="Ap">
      
      
      
      
    </div>
      
          {/*users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))*/}
          </div>
        
  );
}

export default admin;
