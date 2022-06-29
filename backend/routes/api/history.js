const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuthentication } = require('../../utils/authentication');
const db = require('../../db/models');
const { User, Song, History, Playlist, Album, Like, Genre } = db;
const id = db.User.id;

const router = express.Router();


router.get('/:userId(\\d+)', asyncHandler(async (req, res) => {
    const history = await History.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User, where: {
                id: req.params.userId
            }
        }, {
            model: Song, include: [{
                model: User,
                include: [{ model: Album }],
            }, { model: Like }, { model: Genre }]
        }, {
            model: Playlist, include: [{
                model: User,
            }]
        }],
    });
    return res.json({
        history,
    });
}));


router.get('/addPlaylist/:userId(\\d+)/:playlistId(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {
    const user = User.findOne(id);
    const playlist = Playlist.findOne(id);
    const userId = req.params.userId;
    const playlistId = req.params.playlistId
    const itemType = 1;

    const previousItems = await History.findAll({ where: { playlistId: playlistId, userId: userId } });
    await previousItems.forEach(element => {
        element.destroy();
    });

    await History.create({
        userId,
        playlistId,
        itemType,
        user,
        playlist
    });

    const history = await History.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User, where: {
                id: req.params.userId
            }
        }, {
            model: Song, include: [{
                model: User,
                include: [{ model: Album }],
            }, { model: Like }, { model: Genre }]
        }, {
            model: Playlist, include: [{
                model: User,
            }]
        }],
    });
    return res.json({
        history,
    });
}));

router.get('/addSong/:userId(\\d+)/:songId(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {
    const user = User.findOne(id);
    const song = Song.findOne(id);
    const userId = req.params.userId;
    const songId = req.params.songId;
    const itemType = 0;

    const previousItems = await History.findAll({ where: { songId: songId, userId: userId } });

    await previousItems.forEach(element => {
        element.destroy();
    });


    await History.create({
        userId,
        songId,
        itemType,
        user,
        song
    });

    const history = await History.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User, where: {
                id: req.params.userId
            }
        }, {
            model: Song, include: [{
                model: User,
                include: [{ model: Album }],
            }, { model: Like }, { model: Genre }]
        }, {
            model: Playlist, include: [{
                model: User,
            }]
        }],
    });
    return res.json({
        history,
    });
}));


router.delete('/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {

    const listeningHistory = await History.findAll({ where: { userId: req.params.id } });

    if (listeningHistory) {
        await listeningHistory.forEach(element => {
            element.destroy();
        });
        res.status(204).end();
    } else {
        res.json({ message: 'Failure' });
    }

}));

module.exports = router;
