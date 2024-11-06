// src/pages/Blogs.js
import { useState, useEffect, useContext } from 'react';
import { Form, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import { Notyf } from 'notyf';
import '../App.css';

export default function Blogs() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [blogs, setBlogs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [blogName, setBlogName] = useState('');

    // Fetch active blogs
    const fetchBlogs = () => {
        const fetchURL = `${process.env.REACT_APP_API_BASE_URL}/blogs/getAllBlogs`;
        fetch(fetchURL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                // Check if data.blogs exists and is an array
                if (data && Array.isArray(data.blogs)) {
                    setBlogs(data.blogs);
                } else {
                    console.error("Unexpected data format:", data);
                    setBlogs([]);
                }
            })
            .catch(err => console.error("Failed to fetch blogs:", err));
    };

    useEffect(() => {
        if (user) {
            fetchBlogs();
        }
    }, [user]);

    const handleSearchByName = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/search-by-name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: blogName })
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data.blogs)) {
                setSearchResults(data.blogs);
            } else {
                console.error('Error searching for blogs:', data.message || "Unexpected data format");
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching for blogs by name:', error);
        }
    };

    const handleClear = () => {
        setBlogName('');
        setSearchResults([]);
    };

    return (
        <Container>
            <div>
                {user && user.isAdmin ? (
                    <AdminView blogsData={blogs} fetchData={fetchBlogs} />
                ) : (
                    <>
                        <h1 className="text-center">Blog Search</h1>
                        <Form>
                            <Form.Group controlId="blogName">
                                <Form.Label>Blog Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={blogName}
                                    onChange={(e) => setBlogName(e.target.value)}
                                    placeholder="Enter blog name"
                                />
                            </Form.Group>
                            <Button onClick={handleSearchByName} className="mt-3 me-2">
                                Search by Name
                            </Button>
                            <Button onClick={handleClear} className="mt-3">
                                Clear
                            </Button>
                        </Form>

                        <h1 className="mt-4 text-center">Search Results</h1>
                        {searchResults && searchResults.length > 0 ? (
                            <ListGroup>
                                {searchResults.map((blog) => (
                                    blog && blog._id && ( // Ensure each blog object and _id exist
                                        <ListGroup.Item key={blog._id}>
                                            <h5>{blog.title || "Untitled"}</h5>
                                            <p>Description: {blog.content || "No content available"}</p>
                                            <p>Author: {blog.author?.name || "Unknown"}</p>
                                            <p>Created on: {
                                                blog.createdAt 
                                                    ? new Date(blog.createdAt).toLocaleDateString()
                                                    : "Date not available"
                                            }</p>
                                        </ListGroup.Item>
                                    )
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
                    </>
                )}
            </div>
        </Container>
    );
}
