import React,{useState,useEffect}from 'react'
import axios from 'axios'

import { client, imageUrl } from '../../clientaxios/Clientaxios'
export default function Tobbar() {
  const [tobbar, setTobbar] = useState([]);
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [mailid, setMailid] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    fetchTobbar();
  }, []);

  const fetchTobbar = () => {
    client.get('/tobbar')
      .then(response => setTobbar(response.data))
      .catch(error => console.error('Error fetching tobbar:', error));
  };

  const handleDelete = async (tobbarId) => {
    try {
      const response = await client.delete(`/tobbar/${tobbarId}`);
      console.log('Response:', response.data);
      fetchTobbar();
    } catch (error) {
      console.error('Error deleting tobbar entry:', error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const newTobbar = {
        number: number,
        location: location,
        mailid: mailid
      };

      if (editingEntryId) {
        // If editing an entry, send a request to update the existing entry
        await client.put(`/tobbar/${editingEntryId}`, newTobbar);
        setEditingEntryId(null); // Reset editing state
      } else {
        // If not editing, send a request to create a new entry
        await client.post('/tobbar', newTobbar);
      }

      clearForm();
      fetchTobbar();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditEntry = (entryId) => {
    const entryToEdit = tobbar.find(entry => entry._id === entryId);
    if (entryToEdit) {
      setNumber(entryToEdit.number);
      setLocation(entryToEdit.location);
      setMailid(entryToEdit.mailid);
      setEditingEntryId(entryToEdit._id); // Set the entry ID being edited
    }
  };

  const clearForm = () => {
    setNumber('');
    setLocation('');
    setMailid('');
    setEditingEntryId(null);
  };


  

  return (
    <div>

    {/*  Header Start */}

    {/*  Header End */}
    <div className="container-fluid">
    <div className="container">
      <div className="row">
        <div className="col">
          <h4>Topbar Management</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="number" className="form-label">Number</label>
              <input type="text" className="form-control" id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input type="text" className="form-control" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="mailid" className="form-label">Mailid</label>
              <input type="text" className="form-control" id="mailid" value={mailid} onChange={(e) => setMailid(e.target.value)} />
            </div>
            <div className="mb-3">
              <button type="button" className="btn btn-primary"  onClick={handleFormSubmit}>
                {editingEntryId ? 'Update Tobbar' : 'Add Tobbar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row mt-4">
        {tobbar.map(entry => (
          <div className="col-md-4" key={entry._id}>
            <div className="card mb-3">
              <div className="card-body">
                <p className="card-text">Number: {entry.number}</p>
                <p className="card-text">Location: {entry.location}</p>
                <p className="card-text">Mailid: {entry.mailid}</p>
                <button className="btn btn-primary me-2" onClick={() => handleEditEntry(entry._id)}>Edit</button>
                &nbsp;     &nbsp;   
                <button className="btn btn-info"  style={{ backgroundColor: '#6f42c1' }}  onClick={() => handleDelete(entry._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
</div>
  </div>

  )
}

