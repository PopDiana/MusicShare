import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import playerReducer from "./player";
import sessionReducer from "./session";
import songsReducer from "./songs";
import usersReducer from "./users";
import playlistsReducer from "./playlists";
import playlistSongsReducer from "./playlistSongs";
import likedSongsReducer from "./liked";
import followingReducer from "./following";
import commentsReducer from "./comments";
import historyReducer from "./history";

const rootReducer = combineReducers({
  session: sessionReducer,
  songs: songsReducer,
  playlists: playlistsReducer,
  playlistSongs: playlistSongsReducer,
  likedSongs: likedSongsReducer,
  player: playerReducer,
  users: usersReducer,
  following: followingReducer,
  comments: commentsReducer,
  history: historyReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
