// components/BlogCard.js
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function BlogCard({ blogProp }) {
    if (!blogProp) {
        return <div>No blog data available</div>; 
    }

    console.log('Blog data:', blogProp);

    const { title, content, author, creationDate, comment, _id } = blogProp;

    return (
        <Card>
            <Card.Body>
                {/* Displaying title instead of name */}
                <Card.Title>{title}</Card.Title>
                {/* Display author */}
                <Card.Subtitle className="mb-2 text-muted">Author: {author}</Card.Subtitle>
                {/* Display creation date */}
                <Card.Subtitle className="mb-2 text-muted">Created on: {new Date(creationDate).toLocaleDateString()}</Card.Subtitle>
                {/* Display content */}
                <Card.Text>{content}</Card.Text>
                {/* Display comment if available */}
                {comment && (
                    <>
                        <Card.Subtitle>Comment:</Card.Subtitle>
                        <Card.Text>{comment}</Card.Text>
                    </>
                )}
                <Link className="btn btn-primary" to={`/blogs/${_id}`}>Details</Link>
            </Card.Body>
        </Card>
    );
}
