// src/components/Home.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css'; // Optional: if you want to add custom styles

const Home = () => {
    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center mt-4">
                        <Card.Body>
                            <Card.Title>Welcome to Blog Central</Card.Title> {/* Updated title */}
                            <Card.Text>
                                Your one-stop solution for managing your blog posts and staying updated with the latest trends.
                            </Card.Text> {/* Updated description */}
                            <Card.Link href="/register" className="btn btn-primary">
                                Get Started
                            </Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
