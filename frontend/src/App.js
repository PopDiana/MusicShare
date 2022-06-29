import React, { useEffect, useState } from "react";
import {Switch, Route} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { getAllSongs } from "./store/songs";
import Banner from "./components/Banner";
import LatestTracks from "./components/LatestTracks";
import SongCover from "./components/SongCover";
import PlaylistDetails from "./components/PlaylistDetails";
import PlaylistSongs from "./components/PlaylistSongs";
import UploadSong from "./components/AddSongPage";
import EditSongPage from "./components/EditSongPage";
import Player from "./components/Player";
import NotFound from "./components/NotFound";
import UserProfile from "./components/UserProfile";
import Discover from "./components/Discover";
import SongDetails from "./components/SongDetails";
import NavigationBar from "./components/NavigationBar";
import { restoreUser } from "./store/session";
import Genre from "./components/Genres";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSongs());
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <NavigationBar isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <Switch>
            <Route path= '/' exact>
              <Banner />
              <LatestTracks />
            </Route>
            <Route path= '/discover' exact>
              <Discover />
            </Route>
            <Route path= '/genre/:genreName' exact>
              <Genre />
            </Route>
            <Route path= '/songs/:songId' exact>
              <SongCover />
              <SongDetails />
            </Route>
            <Route path= '/playlists/:playlistId' exact>
              <PlaylistDetails />
              <PlaylistSongs />
            </Route>
            <Route path= '/songs/:songId/edit' exact>
              <EditSongPage />
            </Route>    
            <Route path= '/users/:userId' exact>
              <UserProfile />
            </Route>
            <Route path= '/upload'>
              <UploadSong />
            </Route>
            <Route path= '/'>
              <NotFound />
            </Route>
          </Switch>
          <Player />
        </>
      )}
      <footer>
          <div>
              <p>@2022 - MusicShare | Music sharing platform</p>
          </div>
      </footer>
    </>
  );
}

export default App;
