import React from "react";
import { Box, Button, Grid, Typography,useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import ButtonLink from "./ButtonLink";
import {useNavigate} from "react-router-dom"
const SideBar = ({closemenu}) => {
const navigate =useNavigate();
    const logout= ()=>{
      localStorage.removeItem("auth")
    navigate("/login")
    } 
  return (
    <Grid container
      height="100%"
      width="100%"
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      sx={{overflowY:"scroll",paddingTop:"5px"}}
    >
     <Grid item  display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="25%" >
        <img src="assets/images/logo/logo.jpeg"  width="25%" style={{borderRadius:"15px",marginBottom:"10px"}}/>
        <Typography variant="h6 text-white">Welcome Admin</Typography>
     </Grid>
     <Grid item direction="column" height="75%" width="100%" paddingLeft={1} paddingRight={1}>
        <ButtonLink  path="/" text="Home"/>
        <ButtonLink path='/blog' text="Blog"/>
        <ButtonLink path='/top' text="Tobbar"/>   
<ButtonLink path='/address' text="Address"/>   
   
<ButtonLink path='/review' text="Review"/>  
<ButtonLink path='/product' text="Product"/>

<ButtonLink path='/contact' text="Contact"/>    
<ButtonLink path='/enquiry' text="Enquiry"/>   
<ButtonLink path='/course' text="Study Course"/> 
<ButtonLink path='/doctor' text="Doctors Details"/>    
<ButtonLink path='/treatments' text="Treatments Page"/>   
  
<ButtonLink path='/admission' text="StudyCenterForms"/>
<ButtonLink path='/clientreview' text="Client Reviews"/>
<ButtonLink path='/popup' text="Popup Datas"/>
           <button 
  onClick={logout}
        style={{ 
          display: 'block', 
          margin: 'auto', 
          color: 'black', // Change text color
          backgroundColor: 'white', // Change background color
          borderRadius: '5px', // Add rounded corners
          padding: '10px 20px', // Add padding
          border: 'none', // Remove border
          cursor: 'pointer' // Change cursor on hover
        }}
      >
        Logout
      </button>
     </Grid>
    </Grid>
  );
};

export default SideBar;
