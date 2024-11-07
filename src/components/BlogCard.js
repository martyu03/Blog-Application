// components/BlogCard.js
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function BlogCard({ blogProp }) {
    if (!blogProp) {
        return <div>No blog data available</div>;
    }

  console.log('Blog data:', blogProp);

    const { title, content, author, createdAt, comments, _id } = blogProp;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Author: {_id}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Content: {content}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Comment: {comments.length}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Created on: {new Date(createdAt).toLocaleDateString()}</Card.Subtitle>
                <Card.Text>{content}</Card.Text>
                <Link className="btn btn-primary" to={`/blogs/${_id}`}>Details</Link>
            </Card.Body>
        </Card>
    );
}
