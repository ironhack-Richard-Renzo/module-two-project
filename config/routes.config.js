const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsController = require('../controllers/posts.controller');
const commentsController = require('../controllers/comments.controller');
const usersController = require('../controllers/users.controller');
const secure = require('../middlewares/secure.middleware');
const productsController = require('../controllers/products.controller')
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
const storage = require('../config/storage.config')

router.get('/posts', secure.isAuthenticated, postsController.list);
router.get('/posts/new', secure.isAuthenticated, postsController.create);
router.post('/posts', secure.isAuthenticated, postsController.doCreate);
router.get('/posts/:id', secure.isAuthenticated, postsController.detail);
router.get('/posts/:id/edit', secure.isAuthenticated, postsController.edit);
router.post('/posts/:id/edit', secure.isAuthenticated, postsController.doEdit);
router.post('/posts/:id/delete', secure.isAuthenticated, postsController.delete);
router.post('/posts/:postId/comments', secure.isAuthenticated, commentsController.create);
router.post('/logout', secure.isAuthenticated, usersController.logout);

router.get('/activate', usersController.activate);
router.get('/register', usersController.register);
router.post('/register', usersController.doRegister);
router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }));
router.get('/authenticate/google/cb', usersController.loginWithGoogle);
router.get('/profile', secure.isAuthenticated, usersController.profile);

router.post('/add-to-wishlist/:id', secure.isAuthenticated, usersController.addToWhishList);
// router.get('/wishlist', secure.isAuthenticated, usersController.populateWishList);
router.get('/profile', secure.isAuthenticated, usersController.profile);
router.post('/profile', secure.isAuthenticated, storage.single('avatar'), usersController.doProfile);
//router.post('/profile', secure.isAuthenticated, usersController.doProfile);

// Routes for productsnpm
router.get('/products', secure.isAuthenticated, productsController.list);
router.get('/products/new', secure.isAuthenticated, productsController.create);
router.post('/products', secure.isAuthenticated, productsController.doCreate);
router.get('/products/:id', secure.isAuthenticated, productsController.detail);
router.get('/products/:id/edit', secure.isAuthenticated, productsController.edit);
router.post('/products/:id/edit', secure.isAuthenticated, productsController.doEdit);
router.post('/products/:id/delete', secure.isAuthenticated, productsController.delete);


//router.get('/', (req, res) => res.redirect('/posts'));
router.get('/', (req, res) => res.redirect('/products'));

module.exports = router;