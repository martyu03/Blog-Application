// src/components/AddComment.js
import { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';

const notyf = new Notyf();

export default function AddComment({ blogId, onAddComment }) {
    const [comment, setComment] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userId = localStorage.getItem('userId'); // Make sure this is set correctly when user logs in

    const handleAddComment = async () => {
    console.log('blogId:', blogId); // Log to check if blogId is defined

    if (!blogId) {
        console.error('Blog ID is undefined.');
        notyf.error("Blog ID is missing");
        return;
    }

    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/blogs/addComment/${blogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ comment })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        notyf.success("Comment added successfully");
        onAddComment(data.blog.comments[data.blog.comments.length - 1]);
        setComment(''); 
    } catch (err) {
        console.error('Error adding comment:', err);
        notyf.error("Failed to add comment");
    } finally {
        setIsLoading(false);
    }
};


    useEffect(() => {
        setIsActive(comment.trim() !== '');
    }, [comment]);

    return (
        <Form className="mt-2" onSubmit={(e) => { e.preventDefault(); handleAddComment(); }}>
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
