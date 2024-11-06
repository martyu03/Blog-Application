import { useState, useEffect, useContext } from 'react';
import { Form, Button, ListGroup, Container, Row, Col, Modal } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import BlogDetails from '../components/BlogDetails'; // Ensure this component is available
import AdminView from '../components/AdminView';
import { Notyf } from 'notyf';
import '../App.css';

export default function Blogs() {
    const { user } = useContext(UserContext);

    const [blogs, setBlogs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [blogTitle, setBlogTitle] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(false);
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

    const handleSearchByTitle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/search-by-title`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: blogTitle })
            });
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data);
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

    // Handle Add Blog Modal
    // const handleShowAddBlogModal = () => {
    //     setShowAddBlogModal(true);
    // };

    // const handleCloseAddBlogModal = () => {
    //     setShowAddBlogModal(false);
    //     setNewBlogTitle('');
    //     setNewBlogContent('');
    // };

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
                               {searchResults.map((blog, index) => (
                                    <ListGroup.Item key={blog._id || index}>
                                    <h5>{blog.title}</h5>
                                    <p>Author: {blog.author?.username}</p> Access username instead of name
                                    <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                                    <p>Description: {typeof blog.description === 'string' ? blog.description : JSON.stringify(blog.description)}</p>
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
                                {/* Add Blog Button */}
                                <Button variant="success" onClick={setShowModal}>
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

                        {/* Modal for Adding Blog */}
                        {/* <Modal show={showAddBlogModal} onHide={handleCloseAddBlogModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Blog</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="newBlogTitle">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newBlogTitle}
                                            onChange={(e) => setNewBlogTitle(e.target.value)}
                                            placeholder="Enter blog title"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="newBlogContent" className="mt-3">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={newBlogContent}
                                            onChange={(e) => setNewBlogContent(e.target.value)}
                                            rows={4}
                                            placeholder="Enter blog content"
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAddBlogModal}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>
                                    Add Blog
                                </Button>
                            </Modal.Footer>
                        </Modal> */}
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
