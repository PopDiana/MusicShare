import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { followUser, getAllUsers, unfollowUser } from '../../store/users';
import { getAllSongs } from '../../store/songs';
import { pauseSong, playPlaylist, shufflePlaylist, startSong } from '../../store/player';
import EditProfileButton from '../EditProfileButton';
import AddPlaylistButton from '../AddPlaylistButton';
import { getAllPlaylists } from '../../store/playlists';
import { getAllLikedSongs } from '../../store/liked';
import { getAllFollowingUsers } from '../../store/following';
import { deleteHistory, getListeningHistory } from '../../store/history';
import './styles.css';
import NoItems from '../NoItems';



const UserProfile = () => {

    const { userId } = useParams();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => (state.session.user));
    const users = useSelector(state => Object.values(state.users));
    const songs = useSelector(state => Object.values(state.songs));
    const likedSongs = useSelector(state => Object.values(state.likedSongs));
    const playlists = useSelector(state => Object.values(state.playlists));
    const following = useSelector(state => Object.values(state.following));
    var history = useSelector(state => Object.values(state.history));
    var playingSong = useSelector(state => (state.player.songId));
    var isPlaying = useSelector(state => (state.player.isPlaying));
    const filteredSongs = songs.filter(song => song.userId === +userId);
    var filteredPlaylists = playlists.filter(playlist => playlist.userId === +userId);
    const filteredUser = users.filter(user => user.id === +userId);
    const user = filteredUser[0];
    const folowersText = user?.followers === 1 ? "follower" : "followers";

    useEffect(() => {
        dispatch(getAllPlaylists());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllLikedSongs(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        dispatch(getAllFollowingUsers(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        dispatch(getListeningHistory(userId));
    }, [dispatch, userId]);



    const follow = (userId) => {
        dispatch(followUser(currentUser?.id, userId));
    }

    const unfolllow = (userId) => {
        dispatch(unfollowUser(currentUser?.id, userId));
    }

    const switchTab = (tabName) => {
        var i;
        var x = document.getElementsByClassName("user-profile-tab");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        var y = document.getElementsByClassName("tab-button");
        for (i = 0; i < y.length; i++) {
            y[i].classList.remove("tab-selected");
        }
        document.getElementById(tabName).style.display = "flex";
        var buttonName = tabName + "-button";
        document.getElementById(buttonName).classList.add("tab-selected");
    }

    const play = useCallback((song) => {
        dispatch(startSong(song));
    }, [dispatch]);

    const clearHistory = () => {
        dispatch(deleteHistory(currentUser?.id));
    }

    const pause = () => {
        dispatch(pauseSong());
    }

    const shuffle = () => {
      dispatch(playPlaylist(filteredSongs, Math.floor(Math.random() * filteredSongs.length), null));
      dispatch(shufflePlaylist());
    }

    let profileEditButtons;
    let followButtons;
    let likesTabButton;
    let historyTabButton;

    if (currentUser?.id !== +userId) {
        filteredPlaylists = filteredPlaylists.filter(playlist => playlist.isSecret === false);
    }

    if (currentUser?.id === +userId) {
        profileEditButtons = (
            <>
                <EditProfileButton />
                <AddPlaylistButton />
            </>
        );
        likesTabButton = (
            <>
                <button id="user-likes-button" className="tab-button"
                    onClick={() => switchTab('user-likes')}>Likes</button> </>
        );
        historyTabButton = (
            <>
                <button id="user-history-button" className="tab-button"
                    onClick={() => switchTab('user-history')}>History</button> </>
        );
    } else if (currentUser?.id) {
        var isFollowing = user?.Follows?.find(follow => follow.followerId === currentUser?.id);
        var displayText = isFollowing ? "Following" : "Follow";
        followButtons = (
            <>
                <button onClick={() => isFollowing ? unfolllow(userId) : follow(userId)}> {displayText} </button>
            </>
        );

    }

    filteredSongs?.sort((a, b) => {
        return b.id - a.id;
    })

    filteredPlaylists?.sort((a, b) => {
        return b.id - a.id;
    })

    history?.sort((a, b) => {
        return b.id - a.id;
    })


    return (
        <div>
            <div className='app-list app-user-profile'>
                <div className='profile-image-large' style={{ backgroundImage: 'url(' + user?.profileImageUrl + ')' }}></div>
                <h1>{user?.username} <i className={`fas ${user?.verified ? "fa-check-circle user-check" : "display-none"}`}></i></h1>
                <h3 id='user-followers-text'>{user?.followers} {folowersText}</h3> 
                <button onClick={() => shuffle()} className='shuffle-button'><b><i className='fa fa-random'></i>SHUFFLE</b></button>                   
                <p>{user?.bio}</p>            
                <div className="row">
                    {profileEditButtons} </div>
                {followButtons}
              
            </div>
            <div className='user-profile-tabs'>
                <button id="user-uploaded-button" className="tab-button tab-selected" onClick={() => switchTab('user-uploaded')}>Uploaded</button>
                <button id="user-playlists-button" className="tab-button" onClick={() => switchTab('user-playlists')}>Playlists</button>
                <button id="user-following-button" className="tab-button" onClick={() => switchTab('user-following')}>Following</button>
                {likesTabButton}
                {historyTabButton}
            </div>
         
            <div className="app-list">
                <div id="user-uploaded" className="user-profile-tab">
                    {filteredSongs.length === 0 ? <><NoItems></NoItems></> : <></>}
                    {filteredSongs.map((song) => {
                        return (
                            <li key={song.id} className='song-card'>
                                <div className='card-image' style={{ backgroundImage: 'url(' + song.imageUrl + ')' }}>
                                    <div className='play-card-song'>
                                        <button className='play-button list-play-button' onClick={() => playingSong === song.id && isPlaying ? pause() : play(song)}>
                                            <i className={`fas ${playingSong === song?.id && isPlaying ? "fa-pause" : "fa-play"}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <Link className='song-link-text' to={{ pathname: `/songs/${song.id}` }}>
                                    <p>{song.title}</p>
                                </Link>
                                <Link className='song-user-link-text' to={{ pathname: `/users/${song.User?.id}` }}>{song.User?.username}</Link>
                            </li>
                        );
                    })}
                </div>

                <div id="user-playlists" className="user-profile-tab" style={{ display: 'none' }}>
                    {filteredPlaylists.length === 0 ? <><NoItems></NoItems></> : <></>}
                    {filteredPlaylists.map((playlist) => {
                        return (
                            <li key={playlist.id} className='song-card'>
                                <div className='card-image app-playlist' style={{ backgroundImage: 'url(' + playlist.imageUrl + ')' }}>

                                </div>

                                <p>
                                    <Link className='song-link-text' to={{ pathname: `/playlists/${playlist.id}` }}>{playlist.name} </Link>
                                    {playlist.isSecret ? <i className="fa fa-lock secret-playlist"></i> : <span></span>}</p>

                                <p className='song-user-link-text'>{playlist?.songNumber} Songs</p>
                            </li>
                        );
                    })}
                </div>

                <div id="user-likes" className="user-profile-tab" style={{ display: 'none' }}>
                    {likedSongs.length === 0 ? <><NoItems></NoItems></> : <></>}
                    {likedSongs.map((song) => {
                        return (
                            <li key={song.id} className='song-card'>
                                <div className='card-image' style={{ backgroundImage: 'url(' + song.imageUrl + ')' }}>
                                    <div className='play-card-song'>
                                        <button className='play-button list-play-button' onClick={() => playingSong === song.id && isPlaying ? pause() : play(song)}>
                                            <i className={`fas ${playingSong === song?.id && isPlaying ? "fa-pause" : "fa-play"}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <Link className='song-link-text' to={{ pathname: `/songs/${song.id}` }}>
                                    <p>{song.title}</p>
                                </Link>
                                <Link className='song-user-link-text' to={{ pathname: `/users/${song.User?.id}` }}>{song.User?.username}</Link>
                            </li>
                        );
                    })}

                </div>
                <div id="user-following" className="user-profile-tab" style={{ display: 'none' }}>
                    {following.length === 0 ? <><NoItems></NoItems></> : <></>}
                    {following.map((user) => {
                        return (<div className="profiles">   <div className='profile-image' style={{ backgroundImage: 'url(' + user?.profileImageUrl + ')' }}></div>
                            <Link className='song-link-text' to={{ pathname: `/users/${user?.id}` }}><h2 className="profile-username">{user?.username}</h2></Link></div>);
                    })}
                </div>
                <div id="user-history" className="user-profile-tab" style={{ display: 'none' }}>
                    {history.length === 0 ? <><NoItems></NoItems></> : <div id='clear-history'><button onClick={() => clearHistory()}>Clear listening history</button></div>}
                    {history.map((item) => {
                        if (item.itemType === 0) {
                            return (                 
                                <li key={item.id} className='song-card'>
                                    <div className='card-image' style={{ backgroundImage: 'url(' + item.Song?.imageUrl + ')' }}>
                                        <div className='play-card-song'>
                                            <button className='play-button list-play-button' onClick={() => playingSong === item.Song?.id && isPlaying ? pause() : play(item.Song)}>
                                                <i className={`fas ${playingSong === item.Song?.id && isPlaying ? "fa-pause" : "fa-play"}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <Link className='song-link-text' to={{ pathname: `/songs/${item.Song?.id}` }}>
                                        <p>{item.Song?.title}</p>
                                    </Link>
                                    <Link className='song-user-link-text' to={{ pathname: `/users/${item.Song?.User?.id}` }}>{item.Song?.User?.username}</Link>
                                </li>
                            );
                        } else {
                            return (
                                <li key={item.id} className='song-card'>
                                    <div className='card-image app-playlist' style={{ backgroundImage: 'url(' + item.Playlist?.imageUrl + ')' }}>

                                    </div>

                                    <p>
                                        <Link className='song-link-text' to={{ pathname: `/playlists/${item.Playlist?.id}` }}>{item.Playlist?.name} </Link>
                                        {item.Playlist?.isSecret ? <i className="fa fa-lock secret-playlist"></i> : <span></span>}</p>

                                    <p className='song-user-link-text'>{item.Playlist?.songNumber} Songs</p>
                                </li>

                            );
                        }

                    })}

                </div>

            </div>
        </div>
    );
};



export default UserProfile;
