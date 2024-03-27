// AddressPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../../clientaxios/Clientaxios';
import Swal from 'sweetalert2';
export default function Address() {
  const [users, setUsers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);
const fetchUsers = () => {
  client.get('/user')
    .then(response => {
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // If response is an object, convert it to an array
        setUsers([response.data]);
      } else {
        console.error('Error fetching users: Response data is not in the expected format');
      }
      console.log('Users:', response.data); // Log users array to check _id values
    })
    .catch(error => console.error('Error fetching users:', error));
};

const handleDelete = async (userId) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await client.delete(`/user/users/${userId}`);
      await Swal.fire('Deleted!', 'User data has been deleted.', 'success');
      fetchUsers();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'User data is safe :)', 'info');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    Swal.fire('Error', 'Failed to delete user data.', 'error');
  }
};


  const handleFormSubmit = async () => {
    try {
      const newUser = { phoneNumber, email, address };
      if (editingUserId) {
        await client.put(`/user/users/${editingUserId}`, newUser);
        setEditingUserId(null);
      } else {
        await client.post('/user/users', newUser);
      }
      clearForm();
      fetchUsers();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditUser = (userId) => {
    const userToEdit = users.find(user => user._id === userId);
    if (userToEdit) {
      setPhoneNumber(userToEdit.phoneNumber);
      setEmail(userToEdit.email);
      setAddress(userToEdit.address);
      setEditingUserId(userToEdit._id);
    }
  };

  const clearForm = () => {
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setEditingUserId(null);
  };

  return (
    <div className="container">
      <h4>User Management</h4>
      <form>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input type="text" className="form-control" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="mb-3">
          <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>
            {editingUserId ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>

      <div className="row">
      {users.map(user => (
  <div className="col-md-4" key={user._id}>
    <div className="card mb-3">
      <div className="card-body">
        <p className="card-text">Phone Number: {user.phoneNumber}</p>
        <p className="card-text">Email: {user.email}</p>
        <p className="card-text">Address: {user.address}</p>
        <button className="btn btn-primary me-2" style={{margin:'10px'}} onClick={() => handleEditUser(user._id)}>Edit</button>
        <button className="btn btn-info" style={{ backgroundColor: '#6f42c1' }} onClick={() => handleDelete(user._id)}>Delete</button>
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
}
