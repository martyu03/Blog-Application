// pages/AddBlog.js
import { useState, useEffect, useContext } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function AddBlog() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(user?.name || ''); // Default to user’s name if available
    const [creationDate, setCreationDate] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (title && content) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [title, content]);

    function handleSubmit(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addBlog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            title,
            content,
            author,
            // Remove creationDate from here
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            notyf.success('Blog Added');
            setTitle('');
            setContent('');
            setAuthor(user?.name || '');
            setRedirect(true);
        } else {
            notyf.error('Unsuccessful Blog Creation');
        }
    });
}

    if (redirect) {
        return <Navigate to="/blogs" />;
    }

    return (
        <Container className="my-4">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="text-center mb-4">Add Blog</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter blog content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Author's name"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Creation Date</Form.Label>
                            <Form.Control
                                type="text"
                                value={creationDate}
                                readOnly
                            />
                        </Form.Group>
                        <div className="text-center mt-4">
                            <Button variant="primary" type="submit" disabled={!isActive}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
