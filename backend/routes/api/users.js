const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuthentication} = require('../../utils/authentication');
const { User, Follow } = require('../../db/models');
const router = express.Router();

const validateRegistration = [
    check('email')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Invalid email.'),
    check('username')
        .isLength({ min: 2 })
        .withMessage('Username must be 2 characters or more.'),
    check('profileImageUrl')
        .matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)
        .withMessage('Image url must end with jpg, gif, or png.'),
    check('bio')
        .isLength({ min: 6 })
        .withMessage('User bio must be 6 characters or more.'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors,
];

const validateEditProfile = [
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Username must be 2 characters or more.'),
    check('profileImageUrl')
        .exists({ checkFalsy: true })
        .isURL()
        .withMessage('Please provide a profile image url.'),
    check('bio')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('User bio must be 6 characters or more.'),
    handleValidationErrors,
];


router.get('/', asyncHandler(async (req, res) => {
    const users = await User.findAll({ include: [{ model: Follow }] });

    return res.json({
        users,
    })
}));


router.get('/following/:id(\\d+)', asyncHandler(async (req, res) => {
    const users = await User.findAll({
        include: [{
            model: Follow, where: {
                followerId: req.params.id
            }
        }]
    });

    return res.json({
        users,
    })
}));


router.put('/:id(\\d+)', requireAuthentication, validateEditProfile, asyncHandler(async (req, res) => {
    const user = req.body;
    const updatedUser = await User.findByPk(req.params.id);

    if (user) {
        updatedUser.username = user.username;
        updatedUser.profileImageUrl = user.profileImageUrl;
        updatedUser.bio = user.bio;

        await updatedUser.save();

        return res.json({
            updatedUser,
            message: 'Success'
        });
    } else {
        res.json({ message: 'Failure' });
    }
}));


router.post('/', validateRegistration, asyncHandler(async (req, res) => {
    const { email, password, username, profileImageUrl, bio } = req.body;
    const user = await User.register({ email, password, username, profileImageUrl, bio });

    await setTokenCookie(res, user);

    return res.json({
        user,
    });
}));


router.put('/follow/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {

    await Follow.create({ userId: req.body.userId, followerId: req.params.id });

    const updatedUser = await User.findByPk(req.body.userId, { include: [{ model: Follow }] });

    updatedUser.followers += 1;
    await updatedUser.save();

    return res.json({
        updatedUser,
        message: 'Success'
    });

}));

router.put('/unfollow/:id(\\d+)', requireAuthentication, asyncHandler(async (req, res) => {

    const removedFollow = await Follow.findOne({ where: { userId: req.body.userId, followerId: req.params.id } });
    if (removedFollow) {
        await removedFollow.destroy();
    }
    const updatedUser = await User.findByPk(req.body.userId, { include: [{ model: Follow }] });
    if (updatedUser.followers > 0) {
        updatedUser.followers -= 1;
    }
    await updatedUser.save();

    return res.json({
        updatedUser,
        message: 'Success'
    });

}));

module.exports = router;
