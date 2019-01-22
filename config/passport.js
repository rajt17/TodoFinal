const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../model/schema');
const keys = require('./keys');
const download = require('image-downloader')

const options = {
    url: 'http://someurl.com/image.jpg',
    dest: '/path/to/dest'                  // Save to /path/to/dest/image.jpg
}

download.image(options)
    .then(({ filename, image }) => {
        console.log('File saved to', filename)
    })
    .catch((err) => {
        console.error(err)
    })


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
module.exports = {
    localAuth: function (passport) {
        passport.use(
            new LocalStrategy((username, password, done) => {
                User.findOne({ email: username }).then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                });
            })
        );
    },
    githubAuth: function (passport) {
        passport.use(
            new GithubStrategy({
                clientID: keys.git.CLIENT_ID,
                clientSecret: keys.git.CLIENT_SECRET,
                callbackURL: '/auth/github/callback',
                profileFields: ['id', 'displayName', 'photos', 'user:email']
            }, (accessToken, refreshToken, profile, done) => {
                //  process.nextTick(function() {

                User.findOne({ githubId: profile.id }).then((currentUser) => {
                    console.log(profile);
                    if (currentUser) {
                        console.log('user is: ', currentUser);
                        done(null, currentUser);
                    } else {
                        
                        new User({
                            githubId: profile.id,
                            username: profile.displayName,
                            email: profile.email,
                            img: profile.id + '.jpg'
                        }).save().then((newUser) => {
                            console.log('created new user: ', newUser);
                            const options = {
                                url: profile._json.avatar_url,
                                dest: 'C:\\Users\\acer\\Desktop\\TodoFinal\\public\\uploads\\' + newUser.img
                            }
                            download.image(options).then(({ filename, image }) => {
                                console.log('File saved to', filename)
                            }).catch((err) => {
                                console.error(err)
                            })
                            done(null, newUser);
                        });
                    }
                });
            })
        )

    },
    facebookAuth: function (passport) {
        passport.use(
            new FacebookStrategy({
                clientID: keys.fb.CLIENT_ID,
                clientSecret: keys.fb.CLIENT_SECRET,
                callbackURL: '/auth/facebook/callback',
                profileFields: ['id', 'displayName', 'photos', 'email']
            }, (accessToken, refreshToken, profile, done) => {

                User.findOne({ facebookId: profile.id }).then((currentUser) => {
                    if (currentUser) {
                        console.log('user is: ', currentUser);
                        done(null, currentUser);
                    } else {
                        
                        new User({
                            facebookId: profile.id,
                            username: profile.displayName,
                            email: profile.email,
                            img: profile.id+'.jpg'
                        }).save().then((newUser) => {
                            console.log('created new user: ', newUser);
                            const options = {
                                url: profile._json.image.url,
                                dest: 'C:\\Users\\acer\\Desktop\\TodoFinal\\public\\uploads\\' + newUser.img
                            }
                            download.image(options).then(({ filename, image }) => {
                                console.log('File saved to', filename)
                            }).catch((err) => {
                                console.error(err)
                            })
                            done(null, newUser);
                        });
                    }
                });
            })
        )

    },
    googleAuth: function (passport) {
        passport.use(
            new GoogleStrategy({
                clientID: keys.google.CLIENT_ID,
                clientSecret: keys.google.CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
                profileFields: ['id', 'displayName', 'photos', 'email']
            }, (accessToken, refreshToken, profile, done) => {

                User.findOne({ googleId: profile.id }).then((currentUser) => {
                    console.log(profile);
                    if (currentUser) {
                        console.log('user is: ', currentUser);
                        done(null, currentUser);
                    } else {
                        console.log(profile.emails);
                        console.log(profile.email);
                        new User({
                            googleId: profile.id,
                            username: profile.displayName,
                            email: profile.email,
                            img: profile.id+'.jpg'
                        }).save().then((newUser) => {
                            console.log('created new user: ', newUser);
                            const options = {
                                url: profile._json.image.url,
                                dest: 'C:\\Users\\acer\\Desktop\\TodoFinal\\public\\uploads\\' + newUser.img
                            }
                            download.image(options).then(({ filename, image }) => {
                                console.log('File saved to', filename)
                            }).catch((err) => {
                                console.error(err)
                            })
                            done(null, newUser);
                        });
                    }
                });
            })
        )
    }

}