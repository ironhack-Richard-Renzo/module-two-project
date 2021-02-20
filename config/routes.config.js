const express = require('express');
const router = express.Router();
const passport = require('passport');
const bidsController = require('../controllers/bids.controller');
//const commentsController = require('../controllers/comments.controller');
const usersController = require('../controllers/users.controller');
const secure = require('../middlewares/secure.middleware');
const productsController = require('../controllers/products.controller')
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
const storage = require('../config/storage.config')

// Routes for Bids
router.get('/bids', secure.isAuthenticated, bidsController.list);
router.get('/bids/new', secure.isAuthenticated, bidsController.create);
router.post('/bids', secure.isAuthenticated, storage.single('image'), bidsController.doCreate);
router.get('/bids/:id', secure.isAuthenticated, bidsController.detail);
router.get('/bids/:id/edit', secure.isAuthenticated, bidsController.edit);
router.post('/bids/:id/edit', secure.isAuthenticated, storage.single('image'), bidsController.doEdit);
router.post('/bids/:id/delete', secure.isAuthenticated, bidsController.delete);
//router.post('/bids/:bidId/comments', secure.isAuthenticated, commentsController.create);
router.post('/logout', secure.isAuthenticated, usersController.logout);

// Routes for Users
router.get('/activate', usersController.activate);
router.get('/register', usersController.register);
router.post('/register', usersController.doRegister);
router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }));
router.get('/authenticate/google/cb', usersController.loginWithGoogle);
router.get('/profile', secure.isAuthenticated, usersController.profile);
router.post('/add-to-wishlist/:id', secure.isAuthenticated, usersController.addToWhishList);
router.post('/remove-from-wishlist/:id', secure.isAuthenticated, usersController.removeFromWhishList);
router.get('/profile', secure.isAuthenticated, usersController.profile);
router.post('/profile', secure.isAuthenticated, storage.single('avatar'), usersController.doProfile);
//router.post('/profile', secure.isAuthenticated, usersController.doProfile);

// Routes for Products
router.get('/products', secure.isAuthenticated, productsController.list);
router.get('/products/new', secure.isAuthenticated, productsController.create);
router.post('/products', secure.isAuthenticated, storage.single('image'), productsController.doCreate);
router.get('/products/:id', secure.isAuthenticated, productsController.detail);
router.get('/products/:id/edit', secure.isAuthenticated, productsController.edit);
router.get('/products/new', secure.isAuthenticated, productsController.create);
router.post('/products/:id/edit', secure.isAuthenticated, storage.single('image'), productsController.doEdit);
router.post('/products/:id/delete', secure.isAuthenticated, productsController.delete);


//router.get('/', (req, res) => res.redirect('/posts'));
router.get('/', (req, res) => res.redirect('/products'));

module.exports = router;