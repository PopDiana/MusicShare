const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuthentication } = require('../../utils/authentication');
const db = require('../../db/models');
const { User, Song, Comment } = db;
const id = db.User.id;

const router = express.Router();

const validateComment = [
    check('body')
        .exists({ checkFalsy: true })
        .not()
        .withMessage('Comment cannot be empty.'),
    handleValidationErrors,
];


router.get('/:songId(\\d+)', asyncHandler(async (req, res) => {
    const comments = await Comment.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
        }, {
            model: Song, where: {
                id: req.params.songId
            }
        }],
    });
    return res.json({
        comments,
    })
}));


router.post('/', requireAuthentication, validateComment, asyncHandler(async (req, res) => {
    const { userId, songId, body } = req.body;
    const user = User.findOne(id);
    const song = Song.findOne(id);

    const updatedSong = await Song.findByPk(songId);
    updatedSong.comments += 1;
    await updatedSong.save();

    await Comment.create({
        userId,
        songId,
        body,
        user,
        song
    });

    const comments = await Comment.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: User,
        }, {
            model: Song, where: {
                id: songId
            }
        }],
    });
    return res.json({
        comments,
    })
}));


router.delete('/:songId(\\d+)/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const songId = req.params.songId
    const removedComment = await Comment.findByPk(commentId);

    const updatedSong = await Song.findByPk(songId);
    if (updatedSong.comments > 0) {
        updatedSong.comments -= 1;
    }
    await updatedSong.save();

    if (removedComment) {
        await removedComment.destroy();
        res.status(204).end()
    } else {
        res.json({ message: 'Failure' });
    }

}));


router.put('/:id(\\d+)', requireAuthentication, validateComment, asyncHandler(async (req, res) => {
    const comment = req.body;
    const updatedComment = await Comment.findByPk(req.params.id);

    if (comment) {
        updatedComment.body = comment.body;

        await updatedComment.save();
        const comments = await Comment.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
            }, {
                model: Song, where: {
                    id: req.body.songId
                }
            }],
        });
        return res.json({
            comments,
            message: 'Success'
        });
    } else {
        res.json({ message: 'Failure' });
    }
}));


module.exports = router;
