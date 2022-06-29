const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuthentication } = require('../../utils/authentication');
const db = require('../../db/models');
const { User, Song, Album, Like, Genre, PlaylistSong, Playlist } = db;
const id = db.User.id;

const router = express.Router();


const validateSong = [
    check('title')
        .exists({ checkFalsy: true })
        .not()
        .withMessage('Please provide a title for your song.'),
    check('imageUrl')
        .matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)
        .withMessage('Image url must end with jpg, gif, or png.'),
    check('songUrl')
        .matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:mp3|m4a|wav)/)
        .withMessage('Song url must end with mp3, m4a, or wav.'),
    handleValidationErrors,
];

router.get('/', asyncHandler(async (req, res) => {
    const songs = await Song.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
            include: [{ model: Album }],
        }, { model: Like }, { model: Genre }],
        where: {
            available: true
        }
    });
    return res.json({
        songs,
    })
}));

router.post('/', requireAuthentication, validateSong, asyncHandler(async (req, res) => {
    const { userId, albumId, imageUrl, songUrl, title, genreId } = req.body;
    const album = Album.findOne(id);
    const user = User.findOne(id);
    const genre = Genre.findOne(id);

    const newSong = await Song.create({
        userId,
        albumId,
        genreId: genreId !== 0 ? genreId : null,
        imageUrl,
        songUrl,
        title,
        album,
        user,
        genre
    });

    return res.json({
        newSong
    });
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const song = await Song.findByPk(req.params.id, {
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Like }, { model: Genre }],
        where: {
            available: true
        }
    });

    return res.json({
        song
    });
}));

router.get('/playlist/:id(\\d+)', asyncHandler(async (req, res) => {

    const songs = await Song.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Like }, { model: Genre }, {
            model: PlaylistSong, where: {
                playlistId: req.params.id
            }
        }]
    });

    return res.json({
        songs,
    })
}));

router.get('/liked/:id(\\d+)', asyncHandler(async (req, res) => {
    const songs = await Song.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
            include: [{ model: Album }],
        }, {
            model: Like, where: {
                userId: req.params.id
            }
        }, { model: Genre }],
        where: {
            available: true
        }
    });
    return res.json({
        songs,
    })
}));

router.put('/like/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {

    await Like.create({ userId: req.body.userId, songId: req.params.id });

    const updatedSong = await Song.findByPk(req.params.id, {
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Like }, { model: Genre }, { model: PlaylistSong }]
    });

    updatedSong.likes += 1;
    await updatedSong.save();

    return res.json({
        updatedSong,
        message: 'Success'
    });

}));

router.put('/unlike/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {

    const removedLike = await Like.findOne({ where: { userId: req.body.userId, songId: req.params.id } });
    if (removedLike) {
        await removedLike.destroy();
    }
    const updatedSong = await Song.findByPk(req.params.id, {
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Like }, { model: Genre }, { model: PlaylistSong }]
    });
    updatedSong.likes -= 1;
    if (updatedSong.likes < 0) {
        updatedSong.likes = 0;
    }
    await updatedSong.save();

    return res.json({
        updatedSong,
        message: 'Success'
    });

}));

router.put('/played', asyncHandler(async (req, res) => {

    const updatedSong = await Song.findByPk(req.body.id, {
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Like }, { model: Genre }, { model: PlaylistSong }]
    });

    updatedSong.plays += 1;
    await updatedSong.save();

    return res.json({
        updatedSong,
        message: 'Success'
    });

}));

router.put('/addToPlaylist', requireAuthentication, asyncHandler(async (req, res) => {

    await PlaylistSong.create({ playlistId: req.body.playlistId, songId: req.body.songId });

    const updatedPlaylist = await Playlist.findByPk(req.body.playlistId, {});
    updatedPlaylist.songNumber += 1;
    await updatedPlaylist.save();

    const updatedSong = await Song.findByPk(req.body.songId, {
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Like }, { model: Genre }]
    });

    return res.json({
        updatedSong,
        message: 'Success'
    });

}));

router.delete('/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {
    const songId = req.params.id;
    const removedSong = await Song.findByPk(songId);

    if (removedSong) {
        await removedSong.destroy();
        res.status(204).end()
    } else {
        res.json({ message: 'Failure' });
    }

}));

router.delete('/deletePlaylistSong/:id(\\d+)/:playlistId(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {

    const updatedPlaylist = await Playlist.findByPk(req.params.playlistId, {});
    if (updatedPlaylist.songNumber > 0) {
        updatedPlaylist.songNumber -= 1;
    }
    await updatedPlaylist.save();

    const removedPlaylistSong = await PlaylistSong.findOne({ where: { songId: req.params.id, playlistId: req.params.playlistId } });

    if (removedPlaylistSong) {
        await removedPlaylistSong.destroy();
        res.status(204).end()
    } else {
        res.json({ message: 'Failure' });
    }

}));

router.put('/:id(\\d+)', requireAuthentication, validateSong, asyncHandler(async (req, res) => {
    const song = req.body;
    const updatedSong = await Song.findByPk(req.params.id, {
        include: [{
            model: User,
            include: [{ model: Album }]
        }, { model: Genre }]
    });

    if (song) {
        updatedSong.imageUrl = song.imageUrl;
        updatedSong.songUrl = song.songUrl;
        updatedSong.title = song.title;
        updatedSong.genreId = song.genreId !== 0 ? song.genreId : null;

        await updatedSong.save();

        return res.json({
            updatedSong,
            message: 'Success'
        });
    } else {
        res.json({ message: 'Failure' });
    }
}));


module.exports = router;
