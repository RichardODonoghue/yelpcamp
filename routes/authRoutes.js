const express = require('express');
const router = express.Router();
const passport = require('passport')
const asyncHandler = require('../utils/asyncHandler')
const ExpressError = require('../utils/expressError');
const User = require('../models/user');
const auth = require('../controllers/authController')

router.route('/register')
    .get(auth.renderRegister)
    .post(asyncHandler(auth.register));

router.route('/login')
    .get(auth.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), asyncHandler(auth.login));

router.get('/logout', auth.logout)

module.exports = router;