import SmallProfile from '../SmallProfile';
import Comments from '../Comments';
import './styles.css';

const SongDetails = () => {
    return (
        <>
            <div className='app-song-details'>
                <div>
                    <SmallProfile />
                    <Comments />
                </div>
            </div>
        </>
    );
};

export default SongDetails;
