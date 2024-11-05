// pages/Login.js
import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const authenticate = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.access) {
                    // Store token
                    localStorage.setItem('token', data.access);

                    // Retrieve user details with the token
                    retrieveUserDetails(data.access);

                    // Clear input fields
                    setEmail('');
                    setPassword('');
                    notyf.success('You are now logged in');
                } else if (data.message === "No email found") {
                    notyf.error("No account found with this email");
                } else if (data.message === "Incorrect email or password") {
                    notyf.error("Incorrect email or password");
                } else if (data.message === "Invalid email format") {
                    notyf.error("Please enter a valid email address");
                } else {
                    notyf.error("An error occurred. Please try again.");
                }
            })
            .catch(() => notyf.error("Network error. Please try again later."));
    };

    const retrieveUserDetails = (accessToken) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // Debugging output
            setUser({
                id: data.user._id,
                email: data.user.email,
                isAdmin: data.user.isAdmin // Ensure isAdmin is set here
            });
        })
        .catch(() => notyf.error("Failed to retrieve user details."));
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        user && user.id ? <Navigate to="/" /> : // Change here to avoid null check error
            <Form onSubmit={authenticate}>
                <h1 className="my-5 text-center">Login</h1>

                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant={isActive ? "primary" : "danger"} type="submit" disabled={!isActive}>
                    Submit
                </Button>
            </Form>
    );
}
