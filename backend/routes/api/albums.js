const express = require('express');
const asyncHandler = require('express-async-handler');
const db = require('../../db/models');
const {Album} = db;

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const albums = await Album.findAll({
        order: [['createdAt', 'DESC']],
    });

    return res.json({
        albums,
    })
}));




module.exports = router;
