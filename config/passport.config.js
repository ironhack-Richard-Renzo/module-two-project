const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.use('local-auth', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, next) => {
    User.findOne({ email }).then(user => {
        if (!user) {
            next(null, null, { email: 'Invalid email or password' });
        } else {
            return user.checkPassword(password).then((match) => {
                if (!match) {
                    user.auth.attempts = user.attempts + 1;
                    user.auth.date = new Date();
                    next(null, null, { email: 'Invalid email or password' });
                } else {
                    if (user.verified && user.verified.date) {
                        next()
                    } else {

                    }
                    next(null, user);
                }
            })
        }
    }).catch(next);
}));

password.use('google-auth', new GoogleStrategy({
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_REDIRECT_URL || '/authentication/google/cb',
}, (accessToken, refreshToken, profile, next) => {

    const googleId = profile.id;
    const name = profile.displayName;
    const email = profile.emails[0] ? profile.emails[0].value : undefined;

    if (googleId && name && email) {
        User.findOne({
                $or: [
                    { email },
                    { 'social.google': googleId }
                ]
            })
            .then(user => {
                if (!user) {
                    user = new User({

                    })
                }

            }).catch(next)


    }

}));