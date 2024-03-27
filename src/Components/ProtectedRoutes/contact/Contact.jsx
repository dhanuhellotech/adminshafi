import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../../clientaxios/Clientaxios';
import Swal from 'sweetalert2';

const ContactPage = () => {
  const [contactDataList, setContactDataList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contact/contacts/getAll');
        // Check if the response data is an array
        if (Array.isArray(response.data.data)) {
          setContactDataList(response.data.data);
        } else {
          console.error('Contact data is not an array:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDelete = async (id) => {
    // Confirm deletion with SweetAlert
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this contact!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await client.delete(`/contact/contacts/${id}`);
        setContactDataList((prevData) => prevData.filter(contactData => contactData._id !== id));
        Swal.fire(
          'Deleted!',
          'Contact has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting contact data:', error);
        if (error.response && error.response.data && error.response.data.error) {
          console.error('Server Error:', error.response.data.error);
        } else {
          console.error('Error deleting data. Please try again.');
        }
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your contact is safe :)',
        'error'
      );
    }
  }; 

  return (
    <div className="container mt-4" style={{margin:'10px'}}>
      <h1 className="text-center">Contact Page Admin Panel</h1>
      <table className="table table-striped table-bordered text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Study Center Comments</th>
            <th>Study Center Subjects</th>
            <th>Hospital Comments</th>
            <th>Hospital Subjects</th>
            <th>Treatments Comments</th>
            <th>Treatments Subjects</th>
            <th>Products Comments</th>
            <th>Products Subjects</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
        {contactDataList.map(contactData => (
  <tr key={contactData._id}>
    <td>{contactData.name}</td>
    <td>{contactData.email}</td>
    <td>{contactData.phoneNumber}</td>
    <td>{contactData.studyCenter ? contactData.studyCenter.comments : ''}</td>
    <td>{contactData.studyCenter ? contactData.studyCenter.subjects : ''}</td>
    <td>{contactData.hospital ? contactData.hospital.comments : ''}</td>
    <td>{contactData.hospital ? contactData.hospital.subjects : ''}</td>
    <td>{contactData.treatments ? contactData.treatments.comments : ''}</td>
    <td>{contactData.treatments ? contactData.treatments.subjects : ''}</td>
    <td>{contactData.products ? contactData.products.comments : ''}</td>
    <td>{contactData.products ? contactData.products.subjects : ''}</td>
    <td>
      <button
        className="btn btn-info"
        style={{ backgroundColor: '#6f42c1',margin:'10px' }}
        onClick={() => handleDelete(contactData._id)}
      >
        Delete
      </button>
    </td>
  </tr>
))}

        </tbody>
      </table>
    </div>
  );
};

export default ContactPage;
  