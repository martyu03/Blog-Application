import { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';

const notyf = new Notyf();

export default function AddComment({ blogId, onAddComment }) { // blogId added here
    const [comment, setComment] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const handleAddComment = () => {
        setIsLoading(true); 
        fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addComment/${blogId}`, { // Correct the endpoint here
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ comment })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Comment added successfully.') {
                    notyf.success("Comment added successfully.");

                    const creationDate = data.post.comments
                        .filter(comments => comments.userId === userId && comments.comment === comment)
                        .slice(-1)[0]?.creationDate;

                    onAddComment({ comment, username, creationDate });
                    setComment('');

                } else {
                    notyf.error("Failed to add comment");
                }
            })
            .catch(err => {
                console.error('Error adding comment:', err);
                notyf.error("Failed to add comment");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setIsActive(comment.trim() !== '');
    }, [comment]);

    return (
        <Form className="mt-2">
            <Form.Group controlId="commentTextarea">
                <Form.Control 
                    as="textarea" 
                    rows={2} 
                    placeholder="Add a comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    className="bg-secondary text-white"
                />
            </Form.Group>
            <Button 
                variant="primary"
                className="mt-2" 
                onClick={handleAddComment}
                disabled={!isActive || isLoading}
            >
                {isLoading ? (
                    <>
                        <Spinner animation="border" size="sm" /> Adding...
                    </>
                ) : (
                    "Add Comment"
                )}
            </Button>
        </Form>
    );
}
