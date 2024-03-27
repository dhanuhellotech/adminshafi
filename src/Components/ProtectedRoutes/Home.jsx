import { Grid,} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './home.css'
import axios from 'axios'
import { client } from '../clientaxios/Clientaxios';

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [formDataList, setFormDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/study');
        setFormDataList(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);




  useEffect(() => {
    const currentHour = new Date().getHours();
    setGreeting(getGreeting(currentHour));
  }, []);



  const getGreeting = (hour) => {
    if (hour >= 5 && hour < 12) {
      return 'Good Morning Admin';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon Admin';
    } else {
      return 'Good Evening Admin';
    }
  };

  return (
<>
      <Grid item xs={6} />
      <div className="">
        {/*  Row 1 */}
        <Container fluid>
          <Row>
            <Col xs={12}>
              <h1>{greeting}</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}>
              <div className="container-fluid">
              <div className="container mt-4" style={{margin:'10px'}}>
<h4>Admission Data</h4>
      <table className="table table-striped table-bordered text-left">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Father's Name</th>
            <th>Father's Occupation</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Marital Status</th>
            <th>Nationality</th>
            <th>Religion</th>
            <th>Mother Tongue</th>
            <th>Educational Qualification</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Courses</th>
       
          </tr>
        </thead>
        <tbody>
          {formDataList.map(formData => (
            <tr key={formData._id}>
              <td>{formData.fullName}</td>
              <td>{formData.fatherName}</td>
              <td>{formData.fatherOccupation}</td>
              <td>{formData.email}</td>
              <td>{formData.dateOfBirth.split('T')[0]}</td>

              <td>{formData.gender}</td>
              <td>{formData.maritalStatus}</td>
              <td>{formData.nationality}</td>
              <td>{formData.religion}</td>
              <td>{formData.motherTongue}</td>
              <td>{formData.educationalQualification}</td>
              <td>{formData.phoneNumber}</td>
              <td>{formData.address}</td>
              <td>{formData.courses.join(', ')}</td>
        
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    

              </div>
            </Col>
          </Row>
        </Container>
      </div>
      </>
   
  );
};

export default Home;
