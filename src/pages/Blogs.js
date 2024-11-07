import { useState, useEffect, useContext } from 'react';
import { Button, ListGroup, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import BlogDetails from '../components/BlogDetails'; // Ensure this component is available
import AdminView from '../components/AdminView';
import { Notyf } from 'notyf';
import '../App.css';

export default function Blogs() {
    const { user } = useContext(UserContext);

    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const notyf = new Notyf();

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

    // Modal functions
    const handleShowModal = (blog) => {
        setSelectedBlog(blog);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBlog(null);
    };

    // Handle Add Blog Modal
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addBlog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                notyf.success('Blog Added');
                setTitle('');
                setContent('');
                setAuthor('');
                fetchBlogs(); // Call fetchData only after a successful response
                setShowModal(false);
            } else {
                notyf.error('Failed to add blog');
            }
        })
        .catch(error => {
            notyf.error('An error occurred while adding the blog');
        });
    };
    
    return (
        <Container>
            <div>
                {user !== null && user.isAdmin ? (
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

                        {/* Modal for Add Blog */}
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Blog</Modal.Title>
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
                                    <Form.Group>
                                        <Form.Label>Author</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter author"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
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
                    </>
                )}
            </div>
        </Container>
    );
}
