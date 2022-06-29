import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { editComment } from "../../store/comments";


const EditComment = ({ setModalDisplay, commentId }) => {

    const { songId } = useParams();
    const comment = useSelector(state => state.comments[`${commentId}`]);
    const dispatch = useDispatch();
    const [body, setBody] = useState(comment?.body);
    const [errors, setErrors] = useState([]);

    const editUserComment = (e) => {
        e.preventDefault();

        setErrors([]);
        dispatch(editComment({
            id: commentId,
            songId,
            body,
        }))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });

        setModalDisplay(false);
    };

    return (
        <form onSubmit={editUserComment}>
            <ul>
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
            <div className='app-input'>
                <label>Edit comment</label>
                <textarea name='body' value={body} onChange={(e) => setBody(e.target.value)}></textarea>
            </div>
            <button>Save</button>
        </form>
    );
};

export default EditComment;
