"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var passport = require('passport');
var CLIENT_ROOT = (process.env.NODE_ENV === "development") ? process.env.CLIENT_URL + "/" : "/";
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect(CLIENT_ROOT);
});
router.get('/github', passport.authenticate('github', {
    scope: ["user", "repo"]
}));
// callback url, called by github
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function (req, res) {
    res.redirect(CLIENT_ROOT);
});
module.exports = router;
//# sourceMappingURL=auth.js.map