import {useSelector} from 'react-redux';
import { useParams } from 'react-router';
import NotFound from '../NotFound';
import EditSong from '../EditSong';
import './styles.css';

const EditSongPage = () => {
    
    const {songId} = useParams();
    const currentUser = useSelector(state => state.session.user);
    const song = useSelector(state => (state.songs[songId]));

    let editForm;
    let notFound;

    if (currentUser.id === song?.User?.id) {
        editForm= (
            <EditSong />
        );
    } else {
        notFound= (
            <NotFound />
        );
    }

    return (
        <>
            {notFound}
            <div className='add-edit-song'>
                {editForm}
            </div>
        </>
    );
};



export default EditSongPage;
