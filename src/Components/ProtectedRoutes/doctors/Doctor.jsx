import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../../clientaxios/Clientaxios';
import Swal from 'sweetalert2';

export default function Doctor() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [degree, setDegree] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    client.get('/doctor')
      .then(response => setDoctors(response.data))
      .catch(error => console.error('Error fetching doctors:', error));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('specialist', specialist);
      formData.append('degree', degree);
      formData.append('image', imageFile);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingDoctorId) {
        await client.put(`/doctor/${editingDoctorId}`, formData, config);
        setEditingDoctorId(null);
      } else {
        await client.post('/doctor/resize', formData, config);
      }

      clearForm();
      fetchDoctors();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditDoctor = (doctorId) => {
    const doctorToEdit = doctors.find(doctor => doctor._id === doctorId);
    if (doctorToEdit) {
      setName(doctorToEdit.name);
      setDescription(doctorToEdit.description);
      setSpecialist(doctorToEdit.specialist);
      setDegree(doctorToEdit.degree);
      setEditingDoctorId(doctorToEdit._id);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this doctor!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      });
  
      if (result.isConfirmed) {
        await client.delete(`/doctor/${doctorId}`);
        fetchDoctors();
        Swal.fire(
          'Deleted!',
          'Your doctor has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your doctor is safe :)',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };
  

  const clearForm = () => {
    setName('');
    setDescription('');
    setSpecialist('');
    setDegree('');
    setImageFile(null);
    setEditingDoctorId(null);
  };


  return (
    <div>
      <div className="container-fluid">
        <div className="container">
          <div className="card" style={{ padding: '20px', margin: '20px 0' }}>
            <h4 className="card-title">Doctor Admin Panel</h4>
            <form method="post" action="/your-upload-endpoint" encType="multipart/form-data">
              <div className="row">
                <div className="col-md-6">
                  <label>Name</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Description</label>
                  <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Specialist</label>
                  <input type="text" className="form-control" value={specialist} onChange={(e) => setSpecialist(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Degree</label>
                  <input type="text" className="form-control" value={degree} onChange={(e) => setDegree(e.target.value)} />
                </div>
                <div className="col-md-12 mt-3">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="col-md-12 mt-3">
                  <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>{editingDoctorId ? 'Update Doctor' : 'Add Doctor'}</button>
                </div>
              </div>
            </form>
          </div>
          <h5 style={{ marginTop: '20px' }}>Existing Doctors</h5>
          <div className="row">
            {doctors.map(doctor => (
              <div className="col-md-4" key={doctor._id}>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Name: {doctor.name}</h5>
                    <p className="card-text">Description: {doctor.description}</p>
                    <p className="card-text">Specialist: {doctor.specialist}</p>
                    <p className="card-text">Degree: {doctor.degree}</p>
                    <img src={doctor.image} alt={doctor.name} className="card-img-top" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
                    <div>
                      <button className="btn btn-info me-2"         style={{ backgroundColor: '#6f42c1',margin:'10px' }} onClick={() => handleDeleteDoctor(doctor._id)}>Delete</button>
                      <button className="btn btn-primary" onClick={() => handleEditDoctor(doctor._id)}>Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
