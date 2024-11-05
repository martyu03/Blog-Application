// src/components/BlogDetails.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Loading from '../components/Loading';
import AddComment from './AddComment';

export default function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);

    // Get the token from local storage
    const token = localStorage.getItem('token');

    useEffect(() => {
    // Fetch the blog by ID
    fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/getBlog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        setBlog(data);
    })
    .catch(err => console.error('Error fetching blog:', err));

    // Fetch comments for the blog
    fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/getComments/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        setComments(data);
    })
    .catch(err => console.error('Error fetching comments:', err));
}, [id, token]);


    const handleAddComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    // Function to format userId for display
    const formatUserId = (userId) => {
        if (userId && userId.length > 6) {
            return `${userId.slice(0, 10)}...`; // Show first 10 characters and ellipsis
        }
        return userId;
    };

    return (
        <div className="blog-details mx-auto" style={{ maxWidth: '900px' }}>
            {blog ? (
                <div className='pt-4'>
                    <Card className='custom-detail-card' style={{ minHeight: '200px' }}>
                        <Card.Body>
                            <Card.Title>{blog.title}</Card.Title> {/* Updated to show title */}
                            <Card.Subtitle className='mb-2 text-muted'>Author: {blog.author}</Card.Subtitle> {/* Author */}
                            <Card.Text>{blog.content}</Card.Text> {/* Updated to show content */}
                            <Card.Text className='text-muted'>Created on: {new Date(blog.createdAt).toLocaleDateString()}</Card.Text> {/* Creation date */}
                        </Card.Body>
                    </Card>
                    <h5 className='text-light mt-3 fw-bold'>Comments</h5>
                    <AddComment id="addComment" blogId={id} onAddComment={handleAddComment} />
                    <div className="mt-3 pb-3">
                        {comments.length > 0 ? (
                            comments.slice().reverse().map((comment, index) => (
                                <Card key={index} className="mt-2 custom-detail-card">
                                    <Card.Body>
                                        <Card.Subtitle className='fw-semibold'>
                                            {formatUserId(comment.userId)}
                                        </Card.Subtitle>
                                        <Card.Text>{comment.comment}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className='text-light'>No comments yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}
