// src/components/AppNavbar.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import '../App.css';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar className="extreme-navbar" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="extreme-brand sparkle">
                    Blog Application
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" className="extreme-link">Home</Nav.Link>

                        {localStorage.getItem('token') ? (
                            <>
                                <Nav.Link as={NavLink} to="/blogs" className="extreme-link">My Blogs</Nav.Link>

                                {/* Use optional chaining to safely access isAdmin */}
                                {user?.isAdmin && (
                                    <NavDropdown title="Admin" id="admin-dropdown" className="extreme-link">
                                        <NavDropdown.Item as={NavLink} to="/addBlog">Add Blog</NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/admin-dashboard">Admin Dashboard</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                
                                <Nav.Link as={Link} to="/logout" className="extreme-link">Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="extreme-link">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register" className="extreme-link">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
