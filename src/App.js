// src/App.js
import './App.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";
import AppNavbar from './components/AppNavBar';
import Home from './components/Home';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Blogs from './pages/Blogs';
import AddBlog from './pages/AddBlog';
import AdminView from './components/AdminView';
import BlogDetails from './components/BlogDetails';

import { useLocation } from 'react-router-dom';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        email: null,
        firstName: null,
        lastName: null,
        mobileNo: null,
    });

    const unsetUser = () => {
        localStorage.clear();
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const userDetails = parseJwt(token);
            if (userDetails) {
                setUser({
                    id: userDetails.id,
                    email: userDetails.email,
                });
            }
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Content />
            </Router>
        </UserProvider>
    );
}

function Content() {
    const location = useLocation();

    return (
        <>
            {location.pathname === '/' ? (
                <Container fluid>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/addBlog" element={<AddBlog />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/blogs/:id" element={<BlogDetails />} /> 
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Container>
            ) : (
                <Container>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/addBlog" element={<AddBlog />} />
                        <Route path="/blogs/:id" element={<BlogDetails />} /> 
                        <Route path="/login" element={<Login />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Container>
            )}
        </>
    );
}

export default App;
