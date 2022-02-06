const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campgroundController = require('../controllers/campgroundController')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const Campground = require('../models/campground');

router.route('/')
    .get(asyncHandler(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, asyncHandler(campgroundController.createCampground));

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
    .get(asyncHandler(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, asyncHandler(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, asyncHandler(campgroundController.destroyCampground));



router.get('/:id/edit', isLoggedIn, isAuthor, asyncHandler(campgroundController.editCampground));



module.exports = router;