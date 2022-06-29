import { useParams } from 'react-router';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import './styles.css'

const SmallProfile = () => {

    const { songId } = useParams();
    const song = useSelector(state => state.songs[`${songId}`]);
    const user = song?.User;

    return (
        <>
            <div className="border-right-grey align-row">
                <div className='song-details-image' style={{ backgroundImage: 'url(' + user?.profileImageUrl + ')' }}></div>
                <Link className='song-link-text' to={{ pathname: `/users/${user?.id}` }}><h2 className="profile-username">{user?.username}</h2></Link>           
            </div>

        </>
    );
};

export default SmallProfile;
