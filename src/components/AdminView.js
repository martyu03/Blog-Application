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
                fetchData(); // Call fetchData only after a successful response
                setShowModal(false);
            } else {
                notyf.error('Failed to add blog');
            }
        })
        .catch(error => {
            notyf.error('An error occurred while adding the blog');
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
                fetchData(); // Call fetchData only after a successful response
                setShowEditModal(false);
            } else {
                notyf.error('Failed to update blog');
            }
        })
        .catch(error => {
            notyf.error('An error occurred while updating the blog');
        });
    };

    const handleDelete = (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/deleteBlog/${selectedBlogId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Blog deleted successfully') {
                    notyf.success('Blog Deleted');
                    fetchData(); // Call fetchData only after a successful response
                } else {
                    notyf.error('Failed to delete blog');
                }
            })
            .catch(error => {
                notyf.error('An error occurred while deleting the blog');
            });
        }
    };

    const handleShowCommentModal = (blogId) => {
        setSelectedBlogId(blogId);
        setShowCommentModal(true);
    };

    const handleCommentSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addComment/${selectedBlogId}`, {  // Change here
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
            console.log(data);
            notyf.success('Comment Added');
            setComment('');
            fetchData(); // Call fetchData only after a successful response
            setShowCommentModal(false);
        } else {
            notyf.error('Failed to add comment');
        }
    })
    .catch(error => {
        notyf.error('An error occurred while adding the comment');
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
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* List of blogs */}
            <Row>
    {blogsData.map((blog) => (
        <Col key={blog._id} sm={12} md={6} lg={4}>
            <Card className="my-3">
                <Card.Body>
    <Card.Title>{blog.title}</Card.Title>
    <Card.Text>{blog.content.substring(0, 100)}...</Card.Text>
    <Card.Text><strong>Author:</strong> {blog.author ? blog.author.name : 'Unknown'}</Card.Text> {/* Safely accessing author */}
    <Card.Text><strong>Creation Date:</strong> {new Date(blog.creationDate).toLocaleDateString()}</Card.Text> {/* Safely formatting the creation date */}
    <div className="text-center">
        <Button variant="warning" onClick={() => handleEdit(blog)}>Edit</Button>
        <Button variant="danger" onClick={() => handleDelete(blog._id)} className="ms-2">Delete</Button>
        <Button variant="info" onClick={() => handleShowCommentModal(blog._id)} className="ms-2">Comment</Button>
    </div>
</Card.Body>

            </Card>
        </Col>
    ))}
</Row>

        </div>
    );
};

export default AdminView;
