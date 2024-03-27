import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../../clientaxios/Clientaxios';
import Swal from 'sweetalert2';

const Admission = () => {
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

  const handleDelete = async (id) => {
    // Confirm deletion with SweetAlert
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this form data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await client.delete(`/study/${id}`);
        setFormDataList((prevData) => prevData.filter(formData => formData._id !== id));
        Swal.fire(
          'Deleted!',
          'Form data has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting form data:', error);
        if (error.response && error.response.data && error.response.data.error) {
          console.error('Server Error:', error.response.data.error);
        } else {
          console.error('Error deleting data. Please try again.');
        }
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your form data is safe :)',
        'error'
      );
    }
  }; 

  return (
    <div className="container mt-4" style={{margin:'10px'}}>
      <h1 className="text-center">Admin Panel</h1>
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
            <th>Delete</th>
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
              <td>
                <button
                  className="btn btn-info"
                  style={{ backgroundColor: '#6f42c1',margin:'10px' }}
                  onClick={() => handleDelete(formData._id)}
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

export default Admission;
