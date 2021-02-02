const createError = require('http-errors');
const mongoose = require('mongoose');
const Product = require('../models/product.model');

module.exports.list = (req, res, next) => {
    Product.find()
        .then((products) => res.render('products/list', { products }))
        .catch(next);
};

module.exports.create = (req, res, next) => {
    res.render('products/new');
};

module.exports.doCreate = (req, res, next) => {
    Product.create({...req.body })
        .then((product) => res.redirect(`/products/${product.id}`))
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('products/new', {
                    errors: error.errors,
                    product: req.body,
                });
            } else {
                next(error);
            }
        });
};

module.exports.detail = (req, res, next) => {
    console.log(req.headers);

    Product.findById(req.params.id)
        .then((product) => {
            if (product) {
                res.render('products/detail', { product });
            } else {
                res.redirect('/products');
            }
        })
        .catch(next);
};

module.exports.edit = (req, res, next) => {
    Product.findById(req.params.id)
        .then((product) => {
            if (product) {
                res.render('products/edit', { product });
            } else {
                next(createError(404, 'Product does not exists'));
            }
        })
        .catch(next);
};

module.exports.doEdit = (req, res, next) => {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { runValidators: true })
        .then((product) => {
            if (product) {
                res.render('products/detail', { product });
            } else {
                next(createError(404, 'Product does not exists'));
            }
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                const product = req.body;
                product.id = req.params.id;
                res.render('products/edit', {
                    errors: error.errors,
                    product: product,
                });
            } else {
                next(error);
            }
        });
};

module.exports.delete = (req, res, next) => {
    Product.findByIdAndDelete(req.params.id)
        .then((product) => {
            if (product) {
                res.redirect('/products');
            } else {
                next(createError(404, 'Product does not exists'));
            }
        })
        .catch(next);
};