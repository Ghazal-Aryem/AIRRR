import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'
import User from './Userr.jsx'
import Admin from './admin_dashboard'
import Nav from './nav'
import Candidate from "./adminpanel/candidatee"
import Matching from "./adminpanel/matching"
import Extraction from "./adminpanel/extraction"
import Dashboard from "./adminpanel/dashboard"
import Analytics from "./adminpanel/analytics"
import JD from "./adminpanel/job_post"
import Logout from "./adminpanel/logout"
import Login2 from "./adm_login"
import Active from "./adminpanel/active"
import {BrowserRouter,Routes,Route} from 'react-router-dom'


function App() {

return(
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Nav/>}></Route>
    <Route path="/register" element={<Signup/>}></Route>
    <Route path="/login" element={<Login/>}></Route>
    <Route path="/userr" element={<User/>}></Route>
    <Route path="/adm_login" element={<Login2/>}></Route>
    <Route path="/admin_dashboard" element={<Admin/>}></Route>
    <Route path="/candidatee" element={<Candidate/>}></Route>
    <Route path="/matching" element={<Matching/>}></Route>
    <Route path="/extraction" element={<Extraction/>}></Route>
    <Route path="/dashboard" element={<Dashboard/>}></Route>
    <Route path="/analytics" element={<Analytics/>}></Route>
    <Route path="/jd" element={<JD/>}></Route>
    <Route path="/logout" element={<Logout/>}></Route>
    <Route path="/active" element={<Active/>}></Route>
    </Routes>
    </BrowserRouter>
)}

export default App



