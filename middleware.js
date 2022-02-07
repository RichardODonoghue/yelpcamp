const Campground = require("./models/campground");
const Review = require("./models/review");
const asyncHandler = require('./utils/asyncHandler')
const ExpressError = require('./utils/expressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('Session: ', req.session)
        console.log("return to ", req.session.returnTo)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in');
        res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this route')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
});

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = asyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this route')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
});