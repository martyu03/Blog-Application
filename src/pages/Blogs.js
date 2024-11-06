import { useState, useEffect, useContext } from 'react';
import { Form, Button, ListGroup, Container, Row, Col, Modal } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import BlogDetails from '../components/BlogDetails'; // Ensure this component is available
import AdminView from '../components/AdminView';
import { Notyf } from 'notyf';
import '../App.css';

export default function Blogs() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [blogs, setBlogs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [blogTitle, setBlogTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Fetch active blogs
    const fetchBlogs = () => {
        const fetchURL = `${process.env.REACT_APP_API_BASE_URL}/blogs/getAllBlogs`;
        fetch(fetchURL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                setBlogs(data.blogs || []);  // Ensuring we set blogs properly
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

    const handleSearchByTitle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs/search-by-title`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: blogTitle })
            });
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data);  // Assuming this returns the correct data structure
            } else {
                console.error('Error searching for blogs:', data.message);
            }
        } catch (error) {
            console.error('Error searching for blogs by title:', error);
        }
    };

    const handleClear = () => {
        setBlogTitle('');
        setSearchResults([]);
    };

    // Modal functions
    const handleShowModal = (blog) => {
        setSelectedBlog(blog);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBlog(null);
    };

    return (
        <Container>
            <div>
                {user !== null && user.isAdmin ? (
                    <AdminView blogsData={blogs} fetchData={fetchBlogs} />
                ) : (
                    <>
                        <h1 className="text-center">Blog Search</h1>
                        <Form>
                            <Form.Group controlId="blogTitle">
                                <Form.Label>Blog Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={blogTitle}
                                    onChange={(e) => setBlogTitle(e.target.value)}
                                    placeholder="Enter blog title"
                                />
                            </Form.Group>
                            <Button onClick={handleSearchByTitle} className="mt-3 me-2">
                                Search by Title
                            </Button>
                            <Button onClick={handleClear} className="mt-3">
                                Clear
                            </Button>
                        </Form>

                        <h1 className="mt-4 text-center">Search Results</h1>
                        {searchResults.length > 0 ? (
                            <ListGroup>
                                {searchResults.map((blog) => (
                                    <ListGroup.Item key={blog._id}>
                                        <h5>{blog.title}</h5>
                                        <p>Author: {blog.author}</p>
                                        <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                                        <p>Description: {blog.description}</p>
                                        <Button variant="primary" onClick={() => handleShowModal(blog)}>
                                            Details
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No blogs found.</p>
                        )}

                        <Row>
                            <Col xs={12} className="mb-4 text-center">
                                <h1>My Blogs</h1>
                            </Col>
                        </Row>
                        <UserView blogsData={blogs} />

                        {/* Modal for Blog Details */}
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>{selectedBlog?.title}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedBlog && <BlogDetails blog={selectedBlog} />}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )}
            </div>
        </Container>
    );
}
