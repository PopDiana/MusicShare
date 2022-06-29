const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuthentication } = require('../../utils/authentication');
const db = require('../../db/models');
const { User, Playlist } = db;
const id = db.User.id;

const router = express.Router();


const validatePlaylist = [
    check('name')
        .exists({ checkFalsy: true })
        .not()
        .withMessage('Please provide a name for your playlist.'),
    check('imageUrl')
        .matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)
        .withMessage('Image url must end with jpg, gif, or png.'),
    handleValidationErrors,
];

router.get('/', asyncHandler(async (req, res) => {
    const playlists = await Playlist.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User
        }]
    });
    return res.json({
        playlists,
    })
}));


router.post('/', requireAuthentication, validatePlaylist, asyncHandler(async (req, res) => {
    const { userId, imageUrl, name, description, isSecret } = req.body;
    const user = User.findOne(id);

    const newPlaylist = await Playlist.create({
        userId,
        imageUrl,
        name,
        description,
        isSecret,
        user,
    });

    return res.json({
        newPlaylist
    });
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const playlist = await Playlist.findByPk(req.params.id, {
        include: [{
            model: User
        }]
    });

    return res.json({
        playlist
    });
}));

router.delete('/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const removedPlaylist = await Playlist.findByPk(playlistId);

    if (removedPlaylist) {
        await removedPlaylist.destroy();
        res.status(204).end()
    } else {
        res.json({ message: 'Failure' });
    }

}));

router.put('/:id(\\d+)', requireAuthentication, validatePlaylist, asyncHandler(async (req, res) => {
    const playlist = req.body;
    const updatedPlaylist = await Playlist.findByPk(req.params.id, {
        include: [{
            model: User
        }]
    });

    if (playlist) {
        updatedPlaylist.imageUrl = playlist.imageUrl;
        updatedPlaylist.description = playlist.description;
        updatedPlaylist.name = playlist.name;
        updatedPlaylist.isSecret = playlist.isSecret;

        await updatedPlaylist.save();

        return res.json({
            updatedPlaylist,
            message: 'Success'
        });
    } else {
        res.json({ message: 'Failure' });
    }
}));


module.exports = router;
