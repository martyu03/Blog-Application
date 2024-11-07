// src/components/UserView.js
import React from 'react';
import BlogCard from './BlogCard';
import { Row } from 'react-bootstrap';

const UserView = ({ blogsData, onDelete }) => { // Add onDelete as a prop
    return (
        <Row>
            {blogsData.map(blog => (
                <BlogCard key={blog._id} blogProp={blog} onDelete={onDelete} /> // Pass onDelete to BlogCard
            ))}
        </Row>
    );
}

export default UserView;
