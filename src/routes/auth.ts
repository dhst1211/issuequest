const express = require('express');
const router = express.Router();
const passport = require('passport');

const CLIENT_ROOT: string = (process.env.NODE_ENV === "development") ? `${process.env.CLIENT_URL}/` : "/"

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(CLIENT_ROOT);
});

router.get('/github', passport.authenticate('github', {
  scope: ["user", "repo"]
}));

// callback url, called by github
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect(CLIENT_ROOT);
});

module.exports = router;
export {}
