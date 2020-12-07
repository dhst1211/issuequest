const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../model/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
  .catch(e => {
    done(e)
  })
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ githubId: profile.id })
      if(user) {
        done(null, user);
      } else {
        const newUser = await new User({
          githubId: profile.id,
          accessToken: accessToken
        }).save()
        done(null, newUser);
      }
    } catch(err) {
      console.error(err);
    }
  }
));
