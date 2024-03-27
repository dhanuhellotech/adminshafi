import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { client } from '../../clientaxios/Clientaxios';

export default function ClientRev() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [stars, setStars] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    client.get('/video')
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('place', place);
      formData.append('stars', stars);
      formData.append('video', videoFile);

      if (editingReviewId) {
        await client.put(`/video/${editingReviewId}`, formData);
        setEditingReviewId(null);
      } else {
        await client.post('/video/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      clearForm();
      fetchReviews();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditReview = (reviewId) => {
    const reviewToEdit = reviews.find(review => review._id === reviewId);
    if (reviewToEdit) {
      setName(reviewToEdit.name);
      setDescription(reviewToEdit.description);
      setPlace(reviewToEdit.place);
      setStars(reviewToEdit.stars);
      setEditingReviewId(reviewToEdit._id);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this review!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      });
  
      if (result.isConfirmed) {
        await client.delete(`/video/${reviewId}`);
        fetchReviews();
        Swal.fire(
          'Deleted!',
          'Your review has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your review is safe :)',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setPlace('');
    setStars('');
    setVideoFile(null);
    setEditingReviewId(null);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="container">
          <div className="card" style={{ padding: '20px', margin: '20px 0' }}>
            <h4 className="card-title">Client Review Admin Panel</h4>
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
                <label>Place</label>
                <input type="text" className="form-control" value={place} onChange={(e) => setPlace(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label>Stars</label>
                <input type="number" className="form-control" value={stars} onChange={(e) => setStars(e.target.value)} />
              </div>
              <div className="col-md-12 mt-3">
                <input type="file" accept="video/*" onChange={handleFileChange} />
              </div>
              <div className="col-md-12 mt-3">
                <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>{editingReviewId ? 'Update Review' : 'Add Review'}</button>
              </div>
            </div>
          </div>
          <h5 style={{ marginTop: '20px' }}>Existing Reviews</h5>
          <div className="row">
  {reviews.map(review => (
    <div className="col-md-4" key={review._id}>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Name: {review.name}</h5>
          <p className="card-text">Description: {review.description}</p>
          <p className="card-text">Place: {review.place}</p>
          <p className="card-text">Stars: {review.stars}</p>
          {review.videoUrl && (
            <video controls className="mb-2" style={{ maxWidth: '100%', maxHeight: '200px' }}>
              <source src={review.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <div>
            <button className="btn btn-info me-2"         style={{ backgroundColor: '#6f42c1',margin:'10px' }} onClick={() => handleDeleteReview(review._id)}>Delete</button>
            <button className="btn btn-primary" onClick={() => handleEditReview(review._id)}>Edit</button>
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
