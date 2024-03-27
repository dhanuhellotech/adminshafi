import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../../clientaxios/Clientaxios';
import Swal from 'sweetalert2';

export default function Blog() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    client.get('/blog')
      .then(response => setBlogs(response.data))
      .catch(error => console.error('Error fetching blogs:', error));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('comments', comments);
      formData.append('date', date);
      formData.append('year', year);
      formData.append('image', imageFile);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingBlogId) {
        await client.put(`/blog/${editingBlogId}`, formData, config);
        setEditingBlogId(null);
      } else {
        await client.post('/blog/resize', formData, config);
      }

      clearForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditBlog = (blogId) => {
    const blogToEdit = blogs.find(blog => blog._id === blogId);
    if (blogToEdit) {
      setTitle(blogToEdit.title);
      setDescription(blogToEdit.description);
      setComments(blogToEdit.comments);
      setDate(blogToEdit.date);
      setYear(blogToEdit.year);
      setEditingBlogId(blogToEdit._id);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this blog!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      });
  
      if (result.isConfirmed) {
        await client.delete(`/blog/${blogId}`);
        fetchBlogs();
        Swal.fire(
          'Deleted!',
          'Your blog has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your blog is safe :)',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setComments('');
    setDate('');
    setYear('');
    setImageFile(null);
    setEditingBlogId(null);
  };


  return (
    <div>
      <div className="container-fluid">
        <div className="container">
          <h1 style={{textAlign:'center'}}>Blogs Page </h1>
          <div className="card" style={{ padding: '20px', margin: '20px 0' }}>
            <h4 className="card-title">Blog Admin Panel</h4>
            <form method="post" action="/your-upload-endpoint" encType="multipart/form-data">
              <div className="row">
                <div className="col-md-6">
                  <label>Title</label>
                  <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Description</label>
                  <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Comments</label>
                  <input type="text" className="form-control" value={comments} onChange={(e) => setComments(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label>Year</label>
                  <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="col-md-12 mt-3">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="col-md-12 mt-3">
                  <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>{editingBlogId ? 'Update Blog' : 'Add Blog'}</button>
                </div>
              </div>
            </form>
          </div>
          <h5 style={{ marginTop: '20px' }}>Existing Blogs</h5>
          <div className="row">
            {blogs.map(blog => (
              <div className="col-md-4" key={blog._id}>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Title: {blog.title}</h5>
                    <h6>Date: {blog.date.split('T')[0]}</h6>
                    <p className="card-text">Description: {blog.description}</p>
                    <img src={blog.image} alt={blog.title} className="card-img-top" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
                    <div>
                      <button className="btn btn-info me-2"    style={{ backgroundColor: '#6f42c1',margin:'10px' }} onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                      <button className="btn btn-primary" onClick={() => handleEditBlog(blog._id)}>Edit</button>
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
