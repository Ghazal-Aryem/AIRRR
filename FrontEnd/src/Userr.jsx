import React ,{useState} from "react";
import "./first.css"; // CSS file for styling
import './App.css'
import Second from "./second";
import JOB_Search from "./adminpanel/job_search"
function user(){


    return(
      <div >
        <Second/>
        <JOB_Search/>
      </div>
    )}

    export default user;