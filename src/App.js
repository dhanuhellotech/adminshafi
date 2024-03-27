import logo from "./logo.svg";
import "./App.css";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import SideBar from "./Components/Dashboard/SideBar";
import React, { useState, useEffect, } from "react";
import Login from "./Components/ProtectedRoutes/Login"; // Import the Login component
import {Routes,Route,Navigate} from "react-router-dom"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loader, setLoader] = useState(false)
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setIsLoggedIn(true);
      setLoader(true)
    } else {
      setIsLoggedIn(false);
      setLoader(true)
    }
  }, []);
  const showMenu = () => {
    setDisplay(true);
  };

  const closeMenu = () => {
    setDisplay(false);
  };

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If the user is not logged in, render the Login component
 

  // If the user is logged in, render the Dashboard layout
  return (
    <div className="App">
     {loader?(
       <Routes>
       <Route path="/*" element={isLoggedIn?  
       <DashboardLayout
       display={display}
     >
       <SideBar />
     </DashboardLayout>:<Navigate to="/login"/>}/>
     <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
     </Routes>
     ):(null)}
    </div>
  );
}

export default App;
