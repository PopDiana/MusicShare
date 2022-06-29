import { useSelector } from 'react-redux';
import './styles.css';
import AddSong from '../AddSong';

const UploadSong = () => {
    const currentUser = useSelector(state => state.session.user);

    let uploadForm;
    let invite;

    if (currentUser) {
        uploadForm = (
            <AddSong user={currentUser} />
        );
    } else {
        invite = (
            <div className='app-invite-content'>
                <h1>Please login or register to upload a song.</h1>
            </div>
        );
    }

    return (
        <div className='add-edit-song'>
            {invite}
            {uploadForm}
        </div>
    );
};



export default UploadSong;
