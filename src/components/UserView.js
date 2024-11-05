// src/components/UserView.js
import React from 'react';
import BlogCard from './BlogCard';  // Change from MovieCard to BlogCard
import BlogSearch from './BlogSearch'; // Assuming this component is also updated
import { Row } from 'react-bootstrap';

const UserView = ({ blogsData }) => {  // Change moviesData to blogsData
    return (
        <>
            {blogsData.map(blog => (  // Change movie to blog
                <BlogCard key={blog._id} blogProp={blog} />  // Change movieProp to blogProp
            ))}
        </>
    );
}

export default UserView;
