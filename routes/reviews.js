const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncHandler = require('../utils/asyncHandler');
const reviews = require('../controllers/reviewsController')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReview, asyncHandler(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncHandler(reviews.deleteReview))

module.exports = router;