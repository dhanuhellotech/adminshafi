import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../../clientaxios/Clientaxios';
import Swal from 'sweetalert2';

const PopupPage = () => {
  const [popupDataList, setPopupDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/popup/popups');
        if (response.data && Array.isArray(response.data)) {
          setPopupDataList(response.data);
        } else {
          console.error('Popup data is not an array or undefined:', response.data);
        }
      } catch (error) {
        console.error('Error fetching popup data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this popup!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await client.delete(`/popup/popups/${id}`);
        setPopupDataList((prevData) => prevData.filter(popupData => popupData._id !== id));
        Swal.fire(
          'Deleted!',
          'Popup has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting popup data:', error);
        if (error.response && error.response.data && error.response.data.error) {
          console.error('Server Error:', error.response.data.error);
        } else {
          console.error('Error deleting data. Please try again.');
        }
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your popup is safe :)',
        'error'
      );
    }
  }; 

  return (
    <div className="container mt-4" style={{ margin: '10px' }}>
      <h1 className="text-center">Popup Page Admin Panel</h1>
      <table className="table table-striped table-bordered text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Services</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {popupDataList.map(popupData => (
            <tr key={popupData._id}>
              <td>{popupData.name}</td>
              <td>{popupData.phone}</td>
              <td>{popupData.email}</td>
              <td>{popupData.services}</td>
              <td>
                <button
                  className="btn btn-info"
                  style={{ backgroundColor: '#6f42c1', margin: '5px' }}
                  onClick={() => handleDelete(popupData._id)}
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

export default PopupPage;
