const router = require('express').Router();
const sessionRouter = require('./session');
const usersRouter = require('./users');
const songsRouter = require('./songs');
const albumsRouter = require('./albums');
const playlistsRouter = require('./playlists');
const commentsRouter = require('./comments');
const historyRouter = require('./history');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/songs', songsRouter);
router.use('/albums', albumsRouter);
router.use('/playlists', playlistsRouter);
router.use('/comments', commentsRouter);
router.use('/history', historyRouter);

module.exports = router;
