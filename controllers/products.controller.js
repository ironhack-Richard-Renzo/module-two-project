const createError = require('http-errors');
const mongoose = require('mongoose');
const Product = require('../models/product.model');

const resultsPerPage = 9;

module.exports.list = (req, res, next) => {

    const { category, name } = req.query
    const filter = {}
    if (category) filter.category = category;
    if (name) filter.name = new RegExp(name, "i");

    const skip = (req.query.page || 0) * resultsPerPage;

    const currentPage = req.query.page || 0;
    let previousPage = 0;
    if (currentPage >= 0) previousPage = currentPage - 1;
    const nextPage = Number(currentPage) + 1;

    Product.find(filter)
        .skip(skip)
        .limit(resultsPerPage)
        .sort('_id')
        .then((products) => res.render('products/list', { products, currentPage, previousPage, nextPage }))
        .catch(next);
};

module.exports.create = (req, res, next) => {
    res.render('products/new');
};

module.exports.doCreate = (req, res, next) => {

    productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        web: req.body.web,
        category: req.body.category,
        brand: req.body.brand
    }

    if (req.file) productData.image = req.file.path;

    Product.create(productData)
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

    productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        web: req.body.web,
        category: req.body.category,
        brand: req.body.brand
    }

    if (req.file) productData.image = req.file.path;

    Product.findByIdAndUpdate(req.params.id, { $set: productData }, { runValidators: true })
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