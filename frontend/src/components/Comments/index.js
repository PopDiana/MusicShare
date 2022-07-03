import { useParams } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteComment, getAllComments } from '../../store/comments';
import { getAllSongs } from '../../store/songs';
import EditComment from '../EditComment';
import AddComment from '../AddComment';
import { Modal } from '../Modal';
import './styles.css';
import NoItems from '../NoItems';

const Comments = () => {

    const { songId } = useParams();
    const song = useSelector(state => state.songs[`${songId}`]);
    const user = useSelector(state => (state.session.user));
    const comments = useSelector(state => Object.values(state.comments));
    const dispatch = useDispatch();
    const [displayModal, setModalDisplay] = useState(false);
    const [commentId, setEditedCommentId] = useState(0);
 
    useEffect(() => {
        dispatch(getAllComments(songId));
    }, [dispatch, songId]);

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch]);

    const Delete = (commentId) => {
        dispatch(deleteComment(songId, commentId));
    };

    const Edit = (id) => {
        setEditedCommentId(id);
        setModalDisplay(true);
    };

    if (!comments) {
        return null;
    }

    let noCommentsText;

    if(comments.length === 0) {
        noCommentsText = <><NoItems></NoItems></>;
    }

    comments?.sort((a, b) => {
        return b.id - a.id;
    })

    return (
        <>
            <div className='comments-section'>
                <AddComment />
                <div className='comments-number'>
                    <h4><i className='fa fa-comment'></i> {song?.comments} comment(s)</h4>
                </div>
                {noCommentsText}
                {comments.map((comment) => {
                    return (<div className='comment-item'>
                        <div className='comment-header'>
                            <Link to={{ pathname: `/users/${comment?.User?.id}` }}>
                                {comment?.User?.username}
                            </Link>
                            <div>
                                <button className='edit-comment-button' 
                                onClick={() => comment.User.id === user.id ? 
                                Edit(comment?.id) : {}}>
                                    <i className='fa fa-pencil'></i>
                                </button>
                                <button className='delete-comment-button' 
                                onClick={() => comment.User.id === user.id ? 
                                Delete(comment?.id) : {}}>
                                    <i className='fa fa-trash'></i>
                                </button>
                                <span className='comment-date'>{comment?.updatedAt}</span>

                            </div>
                        </div>
                        <p className='comment-body'>{comment?.body}
                        </p>
                    </div>);
                })}
                {displayModal && (
                    <Modal onClose={() => setModalDisplay(false)}>
                        <EditComment setModalDisplay={setModalDisplay} commentId={commentId} />
                    </Modal>
                )}
            </div>
        </>
    );
};



export default Comments;
