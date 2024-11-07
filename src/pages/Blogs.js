import { useState, useEffect, useContext } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import BlogCard from '../components/BlogCard'; // Import BlogCard component
import AdminView from '../components/AdminView'; // Ensure this component is available
import { Notyf } from 'notyf';
import '../App.css';

export default function Blogs() {
    const { user } = useContext(UserContext);
    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editBlogId, setEditBlogId] = useState(null);
    const notyf = new Notyf();

    // Fetch blogs
    const fetchBlogs = () => {
        const fetchURL = `${process.env.REACT_APP_API_BASE_URL}/blogs/getAllBlogs`;
        fetch(fetchURL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            setBlogs(data.blogs || []);
        })
        .catch(err => {
            console.error("Failed to fetch blogs:", err);
            alert("An error occurred while fetching blogs.");
        });
    };

    useEffect(() => {
        if (user) {
            fetchBlogs();
        }
    }, [user]);

    // Handle Delete
    const handleDelete = (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/deleteBlog/${blogId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    notyf.success('Blog Deleted');
                    fetchBlogs(); // Refresh blog list after successful deletion
                } else {
                    notyf.error('Failed to delete blog');
                }
            })
            .catch(error => {
                notyf.error('An error occurred while deleting the blog');
            });
        }
    };

    // Handle Edit Blog Modal
    const handleEditBlog = (blog) => {
        setSelectedBlog(blog); // Ensure the blog object is being passed correctly
        setTitle(blog.title); // Set title for the modal input
        setContent(blog.content); // Set content for the modal input
        setEditBlogId(blog._id);  // Set the blog ID for updating
        setShowModal(true); // Show the modal
    };
    

    // Handle Submit (Add or Update Blog)
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const method = selectedBlog ? 'PUT' : 'POST'; 
        const url = selectedBlog
            ? `${process.env.REACT_APP_API_BASE_URL}/blogs/updateBlog/${editBlogId}` 
            : `${process.env.REACT_APP_API_BASE_URL}/blogs/addBlog`; 
    
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ title, content }) 
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                notyf.success(selectedBlog ? 'Blog Updated' : 'Blog Added');
                setTitle('');
                setContent('');
                fetchBlogs(); 
                setShowModal(false);
            } else {
                notyf.error('Failed to save blog');
            }
        })
        .catch(error => {
            notyf.error('An error occurred while saving the blog');
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBlog(null);
        setTitle('');
        setContent('');
    };

    return (
        <Container>
            <div>
                {user && user.isAdmin ? (
                    <AdminView blogsData={blogs} fetchData={fetchBlogs} />
                ) : (
                    <>
                        <Row>
                            <Col xs={12} className="mb-4 text-center">
                                <h1>My Blogs</h1>
                                {/* Add Blog Button */}
                                <Button variant="success" onClick={() => setShowModal(true)}>
                                    Add Blog
                                </Button>
                            </Col>
                        </Row>
                        {/* Display Blogs */}
                        <Row>
                            {blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <Col key={blog._id} md={4} className="mb-4">
                                        <BlogCard blogProp={blog} />
                                        <div className="d-flex justify-content-between">
                                            <Button
                                                variant="warning"
                                                onClick={() => handleEditBlog(blog)}
                                                className="mt-2 mb-3"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(blog._id)}
                                                className="mt-2 mb-3"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <p>No blogs available.</p>
                                </Col>
                            )}
                        </Row>
                    </>
                )}
            </div>

            {/* Modal for Blog Details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBlog ? 'Edit Blog' : 'Add Blog'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="text-center mt-3">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
