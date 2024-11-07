import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import Loading from '../components/Loading';
import AddComment from './AddComment';
import { Notyf } from 'notyf';

export default function BlogDetails() {
    const { id } = useParams(); // Get the blog ID from URL parameters
    const [blog, setBlog] = useState(null); // State for storing the blog data
    const [comments, setComments] = useState([]); // State for storing blog comments
    const [isAdmin, setIsAdmin] = useState(false); // State to store whether the user is an admin
    const notyf = new Notyf();
    
    // Get the token from local storage
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Decode the token to check for the user's role (admin or not)
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            setIsAdmin(decodedToken.isAdmin); // Assuming the JWT has an 'isAdmin' field
        }

        // Fetch the blog post by ID
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/getBlog/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token here for authentication
            }
        })
            .then(res => res.json())
            .then(data => {
                setBlog(data); // Store the fetched blog data
                setComments(data.comments); // Store the blog comments
            })
            .catch(err => console.error('Error fetching blog:', err));
    }, [id, token]); // Add token as a dependency to useEffect to refetch if it changes

    const handleAddComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]); // Add new comment to the list
    };

    const handleDeleteComment = (commentId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/removeComment/${id}/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
                    notyf.success('Comment Deleted');
                } else {
                    console.error('Error deleting comment:', data.message);
                }
            })
            .catch(err => console.error('Error deleting comment:', err));
    };
    

    // Function to format userId for display
    const formatUserId = (userId) => {
        if (userId && userId.length > 15) {
            return `${userId.slice(0, 10)}...`; // Show first 10 characters and ellipsis
        }
        return userId;
    };

    const navigate = useNavigate();

    const back = () => {
        navigate(`/blogs/`); // Redirect to the blog list
    };

    return (
        <div className="blog-details mx-auto" style={{ maxWidth: '900px' }}>
            {blog ? ( // Check if blog data is available
                <div className='pt-4'>
                    <Card className='custom-detail-card' style={{ minHeight: '200px' }}>
                        <Card.Body>
                            <div className='d-flex justify-content-between'>
                                <Card.Title>{blog.title}</Card.Title>
                                <Button variant="btn" className="btn-sm" onClick={back}>
                                    Back
                                </Button>
                            </div>

                            {/* Removed the Card.Img for the image */}
                            <Card.Text>{blog.content}</Card.Text> 
                            <Card.Subtitle className="mb-2 text-muted">Author: {blog.author._id}</Card.Subtitle>
                            <div className='d-flex justify-content-between'>
                                <Card.Text>{new Date(blog.createdAt).toLocaleString()}</Card.Text> {/* Show the creation date */}
                            </div>
                        </Card.Body>
                    </Card>
                    <h5 className='text-light mt-3 fw-bold'>Comments</h5>
                    <AddComment id="addComment" blogId={id} onAddComment={handleAddComment} /> {/* Pass blogId instead of movieId */}
                    <div className="mt-3 pb-3">
                        {comments.length > 0 ? (
                            comments.slice().reverse().map((comment, index) => ( // Reverse comments to show the latest first
                                <Card key={index} className="mt-2 custom-detail-card">
                                    <Card.Body>
                                        <div className='d-flex justify-content-between'>
                                            <Card.Subtitle className='fw-semibold'>
                                                {formatUserId(comment.username)}
                                            </Card.Subtitle>
                                            <Card.Text>{new Date(comment.createdAt).toLocaleString()}</Card.Text>
                                        </div>
                                        
                                        <Card.Text>{comment.comment}</Card.Text>
                                        
                                        {/* Render delete button only for admin users */}
                                        {isAdmin && (
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => handleDeleteComment(comment._id)}>
                                                Delete
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className='text-light'>No comments yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <Loading /> // Show loading state while the blog data is being fetched
            )}
        </div>
    );
}
