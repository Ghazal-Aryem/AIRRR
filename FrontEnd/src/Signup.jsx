import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./first.css"; // CSS file for styling
import { useNavigate } from "react-router-dom";
import img from "./assets/img3.jpg"; // Importing the image

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!email || !password || !name) {
            alert("Please fill in all fields");
            return;
        }
        console.log(name, email, password);
        // Proceed with signup
        try {
             const response = await axios.post(
        'http://localhost:8080/api/userValidation/user/signup',
        { name ,  email, password },
                 { headers: { "Content-Type": "application/json" } }
              );
            setMessage(response.data.message);
            if (response.data.message === "User registered successfully") {
                // alert("Registered successfully");
                navigate('/Userr');
            }
            else if (response.status === 400) {
                alert("email already exists");
            }
            else {
                alert(response.data.detail || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error during signup. Please try again.");
        }
    };

    return (
        <div
            className="d-flex justify-content-end align-items-center vh-100"
            style={{
                backgroundImage: `url(${img})`,  // Correct way to apply the background image
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div
                className=" p-5 rounded w-30 "
                style={{ backgroundColor:"white",color: "black" ,marginRight:"3%" ,textAlign:"center" ,fontWeight:"bold"}} // Adding black background and white text color
            >
                <h2 >SIGN UP</h2>
                <div className="mb-3">
                    {/* Name Input */}
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-control" // Ensures input fields are styled correctly
                    />
                </div>
                <div className="mb-3">
                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control" // Ensures input fields are styled correctly
                    />
                </div>
                <div className="mb-3 text-dark">
                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control  " // Ensures input fields are styled correctly
                    />
                </div>
                {/* Sign Up Button */}
                <button onClick={handleSubmit} className="btn btn-sign">
                    Sign Up
                </button>

                {message && <p className="mt-3 text-center">{message}</p>}

                <Link to="/login" className="btn btn-default" style={{color:"black", textDecoration: "none"}} >
                    Already a member? Login here
                </Link>
            </div>

        </div>
    );
}

export default Signup;
