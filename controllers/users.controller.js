const mongoose = require('mongoose');
const httpError = require('http-errors');
const User = require('../models/user.model');
const mailer = require('../config/mailer.config');
const passport = require('passport');

module.exports.register = (req, res, next) => {
    res.render('users/register', { layout: 'loginLayout.hbs' });
};

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('users/register', {
            layout: 'loginLayout.hbs',
            user: req.body,
            errors: errors,
        });
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                renderWithErrors({ email: 'Email is already registered ' });
            } else {
                return User.create(req.body).then((user) => {
                    mailer.sendValidationEmail(user.email, user.verified.token, user.name);

                    res.render('users/login', { layout: 'loginLayout.hbs', verification: true });
                });
            }
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                renderWithErrors(error.errors);
            } else {
                next(error);
            }
        });
};

module.exports.login = (req, res, next) => {
    res.render('users/login', { layout: 'loginLayout.hbs' });
};

module.exports.loginWithGoogle = (req, res, next) => {
    passport.authenticate('google-auth', (error, user, validations) => {
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render('users/login', { user: req.body, errors: validations });
        } else {
            req.login(user, error => {
                if (error) next(error)
                else res.redirect('/')
            })
        }
    })(req, res, next);
}

module.exports.doLogin = (req, res, next) => {
    passport.authenticate('local-auth', (error, user, validations) => {
        if (error) {
            next(error);
        } else if (!user) {
            res.status(400).render('users/login', { user: req.body, errors: validations });
        } else {
            req.login(user, error => {
                if (error) next(error)
                else res.redirect('/')
            })
        }
    })(req, res, next);
};

module.exports.logout = (req, res, next) => {
    req.logout();
    res.redirect('/login');
};

module.exports.activate = (req, res, next) => {
    User.findOneAndUpdate({ 'verified.token': req.query.token }, { $set: { verified: { date: new Date(), token: null } } }, { runValidators: true }).then(user => {
        if (!user) {
            next(httpError(404, 'Invalid activation token'))
        } else {
            res.redirect('/login');
        }
    }).catch(next);
};

module.exports.profile = (req, res, next) => {
    User.findById(req.user.id).populate('wishlist')
        .then(user => res.render('users/profile', { user }))
        .catch(next)
}

module.exports.addToWhishList = (req, res, next) => {

    const objectIdStr = req.params.id.toString();

    User.findOne({ _id: req.user.id })
        .then(user => {

            let repeated = false;
            user.wishlist.map(index => { if (index === objectIdStr) repeated = true });

            if (!repeated) {
                User.updateOne({ _id: user.id }, { $push: { wishlist: req.params.id } }, { new: true }).then(user => {
                    if (!user) {
                        next(httpError(404, 'Invalid user'))
                    } else {
                        res.redirect('/products');
                    }
                }).catch(next);

            } else {
                res.redirect('/products');
            }
        }).catch(next);
}

module.exports.removeFromWhishList = (req, res, next) => {

    const objectIdStr = req.params.id.toString();

    User.findOne({ _id: req.user.id })
        .then(user => {

            const index = user.wishlist.indexOf(objectIdStr);
            user.wishlist.splice(index, 1);

            User.updateOne({ _id: user.id }, { wishlist: user.wishlist }, { new: true }).then(user => {
                if (!user) {
                    next(httpError(404, 'Invalid user'))
                } else {
                    res.redirect('/profile');
                }
            }).catch(next);

        }).catch(next);
}

module.exports.doProfile = (req, res, next) => {

    function renderWithErrors(errors) {
        Object.assign(req.user, req.body);
        res.status(400).render('users/profile', {
            user: req.user,
            errors: errors,
        });
    }

    const { password, passwordMatch, name, description, latitude, longitude } = req.body;
    if (password && password !== passwordMatch) {
        renderWithErrors({ passwordMatch: 'Password do not match' })
    } else {
        const updateFields = { name, description }
        if (req.file) {
            updateFields.avatar = req.file.path;
        }
        if (password) {
            updateFields.password = password
        }

        if (latitude && longitude) {

            updateFields.location = {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)]
            };
        } else {
            updateFields.location = undefined;
        }

        Object.assign(req.user, updateFields);
        req.user.save()
            .then(user => {
                req.login(user, error => {
                    if (error) next(error)
                    else res.redirect('/profile');
                });
            }).catch(error => {
                if (error instanceof mongoose.Error.ValidationError) {
                    renderWithErrors(error.errors);
                } else {
                    next(error);
                }
            })
    }
}