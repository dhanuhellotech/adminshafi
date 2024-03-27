import React,{useState,useEffect}from 'react'
import axios from 'axios'

import { client, imageUrl } from '../../clientaxios/Clientaxios'
export default function Newsletter() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedDetails, setUploadedDetails] = useState([]);
  const [editingPDFId, setEditingPDFId] = useState(null);
  const [newFilename, setNewFilename] = useState('');
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 // Inside updateNewsletterById function
 const handleFormSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('pdf', file);
    formData.append('newFilename', newFilename); // Append new filename to formData
    
    if (editingPDFId) {
      // If editing, send a request to update the existing PDF
      await client.put(`/newsletter/${editingPDFId}`, formData);
      setEditingPDFId(null); // Reset editing state
    } else {
      // If not editing, send a request to create a new PDF
      const response = await client.post('/newsletter/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Upon successful creation, update state to display the new PDF name
      const { filename } = response.data;
      setUploadedDetails([...uploadedDetails, { title, description, filename }]); // Update state with new PDF details
    }

    clearForm();
    fetchUploadedDetails();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to upload PDF.');
  }
};



  const fetchUploadedDetails = async () => {
    try {
      const response = await client.get('/newsletter');
      setUploadedDetails(response.data);
    } catch (error) {
      console.error('Error fetching uploaded details:', error);
    }
  };

  useEffect(() => {
    fetchUploadedDetails();
  }, []); // Fetch uploaded details when component mounts

  const handleDeletePDF = async (id) => {
    try {
      await client.delete(`/newsletter/${id}`);
      fetchUploadedDetails();
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  const handleEditPDF = (id) => {
    // Find the PDF details by ID
    const pdfToEdit = uploadedDetails.find(pdf => pdf._id === id);
    if (pdfToEdit) {
      // Populate form fields with the existing data
      setTitle(pdfToEdit.title);
      setDescription(pdfToEdit.description);
      setEditingPDFId(id); // Set the PDF ID being edited
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setEditingPDFId(null);
  };

  

  return (
    <div>

    {/*  Header Start */}
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" href="javascript:void(0)">
              <i className="ti ti-menu-2" />
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link nav-icon-hover" href="javascript:void(0)">
              <i className="ti ti-bell-ringing" />
              <div className="notification bg-primary rounded-circle" />
            </a>
          </li>
        </ul>
        <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <a href="https://adminmart.com/product/modernize-free-bootstrap-admin-dashboard/" target="_blank" className="btn btn-primary">Download Free</a>
            <li className="nav-item dropdown">
              <a className="nav-link nav-icon-hover" href="javascript:void(0)" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../assets/images/profile/user-1.jpg" alt width={35} height={35} className="rounded-circle" />
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                <div className="message-body">
                  <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-user fs-6" />
                    <p className="mb-0 fs-3">My Profile</p>
                  </a>
                  <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-mail fs-6" />
                    <p className="mb-0 fs-3">My Account</p>
                  </a>
                  <a href="javascript:void(0)" className="d-flex align-items-center gap-2 dropdown-item">
                    <i className="ti ti-list-check fs-6" />
                    <p className="mb-0 fs-3">My Task</p>
                  </a>
                  <a href="./authentication-login.html" className="btn btn-outline-primary mx-3 mt-2 d-block">Logout</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    {/*  Header End */}
    <div className="container-fluid">
    <div className="container">
      <h4>Upload PDF</h4>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">New Filename</label>
          <input type="text" className="form-control" value={newFilename} onChange={(e) => setNewFilename(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">{editingPDFId ? 'Update' : 'Upload'}</button>
        </div>
      </form>

      <h5 style={{ marginTop: '20px' }}>Uploaded PDFs</h5>
      <ul className="list-group">
        {uploadedDetails.map((detail, index) => (
          <React.Fragment key={index}>
            <li className="list-group-item">
              <div>Title: {detail.title}</div>
              <div>Description: {detail.description}</div>
              <div>Filename: {detail.filename}</div>
              <div>
                <button className="btn btn-danger me-2" onClick={() => handleDeletePDF(detail._id)}>Delete</button>
                <button className="btn btn-primary" onClick={() => handleEditPDF(detail._id)}>Edit</button>
              </div>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
</div>
  </div>

  )
}

