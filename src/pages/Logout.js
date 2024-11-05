// pages/Logout.js
import { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // Import the CSS for styling

const Logout = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const notyf = new Notyf();

    useEffect(() => {
        logout(); // Call the logout function
        notyf.success('Logout successfully'); // Show success message
        navigate('/'); // Redirect to home or login page
    }, [logout, navigate, notyf]);

    return null; // Render nothing
};

export default Logout;
