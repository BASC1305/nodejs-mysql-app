const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isloggedin, isnotloggedin } = require('../lib/auth');


router.get('/signup', isnotloggedin, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isnotloggedin, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true

}));

router.get('/signin', isnotloggedin, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isloggedin, (req, res) => {
    res.render('profile');
});

router.get('/logout', isloggedin, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;