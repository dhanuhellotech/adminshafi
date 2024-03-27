import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {Formik} from 'formik';
import axios from 'axios';
import { client,imageUrl } from '../clientaxios/Clientaxios';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import './Login.css'; // Import your CSS file

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login button clicked.");

    // Perform authentication logic here
    const validEmail = 'Shafichannel123@gmail.com';
    const validPassword = 'Shafichannel123@gmail.com';

    if (email === validEmail && password === validPassword) {
      console.log("Login successful.");
      onLogin();
       // Call the callback function passed from the parent component
       localStorage.setItem("auth", true);
      navigate('/'); // Redirect to the home page upon successful login
    } else {
      setError('Invalid credentials. Please enter correct email and password.');
    }
  };

  console.log("Rendering Login component.");
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };
  const handleForgotPassword = async (values) => {
    try {
        const response = await client.post('/api/send-reset-email', { email: values.email });
        alert(response.data.message); // Display success message from the server
        handleClose();
    } catch (error) {
        console.error('Error sending reset password email:', error.message);
        alert('Failed to send reset password email. Please try again later.');
    }
};
  return (
    <div className="page-wrapper login-background " id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-6 col-xxl-3">
              <div className="card mb-0">
                <div className="card-body">
            
                    {/* <img src="../assets/images/logos/dark-logo.svg" width={180} alt="Logo" /> */}
                    <h3 className='text-nowrap logo-img text-center d-block py-3 w-100 text-white'>Welcome Admin</h3>
              
                  <h2 className="text-center mb-4 text-white">Login</h2>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <button type="button" className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
                  <p className="text-center text-white"  style={{ cursor: 'pointer',fontSize:'25px',fontWeight:'bold'}} onClick={toggleModal}>
            Forgot Password?
          </p>
          <Modal isOpen={modalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}  className="forgot" >Forgot Password?</ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email('Invalid email').required('Email is required')
                })}
                onSubmit={(values) => handleForgotPassword(values)}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>  
                    <FormGroup>
                      <Label for="forgot-email">Email Address</Label>
                      <Input
                        type="email"
                        name="email"
                        id="forgot-email"
                        placeholder="Enter your email address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.email && !!errors.email}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </FormGroup>
                    <ModalFooter>
                      <Button color="secondary" onClick={toggleModal}>
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Send Reset Email
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </Modal>
 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
