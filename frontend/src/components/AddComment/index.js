import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { getAllSongs } from '../../store/songs';
import { postComment } from '../../store/comments';
import './styles.css';

const AddComment = () => {
    const { songId } = useParams();
    const currentUser = useSelector(state => (state.session.user));
    const userId = currentUser?.id;
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch]);

    const addComment = (e) => {
        e.preventDefault();

        setErrors([]);
        var body = commentText;
        dispatch(postComment({
            userId,
            songId,
            body,
        }))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        setCommentText('');
    };

    return (
        <>
            <form id='add-comment-form' onSubmit={addComment}>
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
                <input type='text' placeholder='Post a comment...' 
                value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <input type='submit' hidden />
            </form>
        </>
    );
};

export default AddComment;
