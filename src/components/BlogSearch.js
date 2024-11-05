// components/BlogSearch.js
import React, { useState } from 'react';
import BlogCard from './BlogCard'; 

const BlogSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:4007/b7/blogs/search', {  // Change the endpoint to search for blogs
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blogName: searchQuery })  // Change the body parameter to blogName
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for blogs:', error); // Updated error message
    }
  };

  return (
    <div>
      <h2>Blog Search</h2> {/* Updated title */}
      <div className="form-group">
        <label htmlFor="blogName">Blog Name:</label>  {/* Updated label */}
        <input
          type="text"
          id="blogName"  // Updated ID
          className="form-control"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={handleSearch}>
        Search
      </button>
      <h3 className="mt-3">Search Results:</h3>
      <ul>
        {searchResults.map(blog => ( // Updated mapping to blog
          <BlogCard blogProp={blog} key={blog._id} />  // Updated component and prop name
        ))}
      </ul>
    </div>
  );
};

export default BlogSearch;
