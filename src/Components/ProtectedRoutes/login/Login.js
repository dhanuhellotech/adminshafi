// LoginPage.js
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // Perform validation and authentication logic here
    // For simplicity, we'll consider the login successful if the username is not empty.
    if (username.trim() !== '') {
      onLogin();
      history.push('/dashboard'); // Redirect to the dashboard upon successful login
    } else {
      alert('Invalid credentials. Please enter a username.');
    }
  };

  return (
<div></div>
  );
};

export default LoginPage;
