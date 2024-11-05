import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { jwtDecode } from 'jwt-decode';

const AdminView = ({ blogsData, fetchData }) => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [comment, setComment] = useState('');
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editBlogId, setEditBlogId] = useState(null);
    const notyf = new Notyf();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAdmin(decoded.isAdmin);
            } catch (error) {
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        setIsActive(title && content && author);
    }, [title, content, author]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addBlog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content, author })
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                notyf.success('Blog Added');
                setTitle('');
                setContent('');
                setAuthor('');
                fetchData();
                setShowModal(false);
            } else {
                notyf.error('Failed to add blog');
            }
        });
    };

    const handleEdit = (blog) => {
        setEditBlogId(blog._id);
        setTitle(blog.title);
        setContent(blog.content);
        setAuthor(blog.author);
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/updateBlog/${editBlogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content, author })
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                notyf.success('Blog Updated');
                setTitle('');
                setContent('');
                setAuthor('');
                fetchData();
                setShowEditModal(false);
            } else {
                notyf.error('Failed to update blog');
            }
        });
    };

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
                if (data.message === 'Blog deleted successfully') {
                    notyf.success('Blog Deleted');
                    fetchData();
                } else {
                    notyf.error('Failed to delete blog');
                }
            });
        }
    };

    const handleShowCommentModal = (blogId) => {
        setSelectedBlogId(blogId);
        setShowCommentModal(true);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addComment/${selectedBlogId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ comment })
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                notyf.success('Comment Added');
                setComment('');
                fetchData();
                setShowCommentModal(false);
            } else {
                notyf.error('Failed to add comment');
            }
        });
    };

    if (!isAdmin) {
        return <h2 className="text-center my-5">Access Denied. You must be an admin to view this page.</h2>;
    }

    return (
        <div>
            <h1 className="text-center my-5">Admin Dashboard</h1>
            <div className='text-center'>
                <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                    Add Blog
                </Button>
            </div>

            {/* Modal for adding a blog */}
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
                            <Button variant="primary" type="submit" disabled={!isActive}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for editing a blog */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
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
                            <Button variant="primary" type="submit" disabled={!isActive}>
                                Update
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for adding a comment */}
            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCommentSubmit}>
                        <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="text-center mt-3">
                            <Button variant="primary" type="submit">
                                Submit Comment
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Display blogs in cards */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {Array.isArray(blogsData) && blogsData.map((blog) => (
                    <Col key={blog._id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{blog.title}</Card.Title>
                                <Card.Text>
                                    <strong>Content:</strong> {blog.content}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Author:</strong> {blog.author}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Comments:</strong>
                                    <ul>
                                        {blog.comments.map((cmt) => (
                                            <li key={cmt._id}>
                                                {cmt.comment} {/* Render the comment text here */}
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Text>
                                <Button variant="primary" onClick={() => handleEdit(blog)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                                    Delete
                                </Button>
                                <Button variant="info" onClick={() => handleShowCommentModal(blog._id)}>
                                    Add Comment
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminView;
