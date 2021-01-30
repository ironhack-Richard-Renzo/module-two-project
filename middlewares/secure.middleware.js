const User = require('../models/user.model');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUserId) {
    User.findById(req.session.currentUserId)
      .then((user) => {
        if (user) {
          req.currentUser = user;
          res.locals.currentUser = user;

          next();
        } else {
          res.redirect('/login');
        }
      })
      .catch(() => {
        res.redirect('/login');
      });
  } else {
    res.redirect('/login');
  }
};
