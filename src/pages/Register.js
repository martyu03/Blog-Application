import { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Register() {
    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState("");  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    const notyf = new Notyf();

    useEffect(() => {
        if (username !== "" && email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [username, email, password, confirmPassword]);

    function registerUser(e) {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_BASE_URL}/users/register`;
    console.log("Register URL:", url);
    
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username, 
            email,
            password
        })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { // Parse the error response
                throw new Error(`HTTP error! status: ${res.status}, message: ${err.message}`);
            });
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
        if (data.message === "User registered successfully") {
            // Clear input fields
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            notyf.success('Registration Successful');
        } else {
            notyf.error(data.message || 'Something went wrong');
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error);
        notyf.error('An error occurred during registration. Please try again.');
    });
}


    // Check if user exists and redirect
    if (user && user.id) {
        return <Navigate to="/blogs" />; // Navigate if user is logged in
    }

    return (
        <Form onSubmit={(e) => registerUser(e)}>
            <h1 className='my-5 text-center'>Register</h1>
            
            <Form.Group>
                <Form.Label>Username:</Form.Label> 
                <Form.Control type='text' placeholder='Enter Username' required value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control type='email' placeholder='Enter Email' required value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control type='password' placeholder='Enter Password' required value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Verify Password:</Form.Label>
                <Form.Control type='password' placeholder='Confirm Password' required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </Form.Group>
            {
                isActive ?
                <Button variant="primary" type="submit" id='submitBtn'>Submit</Button> :
                <Button className="mt-3" variant="danger" type="submit" id='submitBtn' disabled>Please enter your registration details</Button>
            }
        </Form>
    );
}
