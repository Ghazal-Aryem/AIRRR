import React from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
const logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default logout;
