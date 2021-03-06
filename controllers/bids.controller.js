const createError = require('http-errors');
const mongoose = require('mongoose');
const Bid = require('../models/bid.model');
const Product = require('../models/product.model');

module.exports.list = (req, res, next) => {

    // const { title, distance, location } = req.query
    // const filter = {}
    // if (title) filter.title = new RegExp(name, "i"); 
    // if (location) filter.location = {
    //     $near: {
    //         $geometry: { type: "Point", coordinates: [req.user.location.coordinates[0], req.user.location.coordinates[1]] },
    //         $minDistance: 0,
    //         $maxDistance: distance || 100000000,
    //     }
    // }

    const distanceToMe = [{
        $geoNear: {
            near: {
                type: 'Point',
                coordinates: [req.user.location.coordinates[0], req.user.location.coordinates[1]]
            },
            spherical: true,
            distanceField: 'distanceFromMe'
        }
    }];

    Bid.aggregate(distanceToMe)
        .sort('distanceFromMe')
        .then((bids) => {
            bids.map(index => { return index.distanceFromMe = (index.distanceFromMe / 1000).toFixed(2) })
            res.render('bids/list', { bids });
        }).catch(next);
};

module.exports.create = (req, res, next) => {
    Product.find()
        .then((products) => res.render('bids/new', { products }))
        .catch(next);
};

module.exports.doCreate = (req, res, next) => {

    bidData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        web: req.body.web,
        expireDate: req.body.expireDate,
        active: req.body.active
    }

    if (req.file) bidData.image = req.file.path;

    bidData.location = {
        type: "Point",
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)]
    };

    bidData.author = req.user.name;
    bidData.product = req.body.product;

    Bid.create(bidData)
        .then((bid) => res.redirect(`/bids/${bid.id}`))
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('bids/new', {
                    errors: error.errors,
                    bid: req.body,
                });
            } else {
                next(error);
            }
        });
};

module.exports.detail = (req, res, next) => {
    Bid.findById(req.params.id)
        .populate('comments')
        .then((bid) => {
            if (bid) {
                Product.find()
                    .then((products) =>
                        res.render('bids/detail', { products, bid }));
            } else {
                res.redirect('/bids');
            }
        })
        .catch(next);
};

module.exports.edit = (req, res, next) => {
    Bid.findById(req.params.id)
        .then((bid) => {
            if (bid) {
                res.render('bids/edit', { bid });
            } else {
                next(createError(404, 'Bid does not exists'));
            }
        })
        .catch(next);
};

module.exports.doEdit = (req, res, next) => {
    bidData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        web: req.body.web,
        expireDate: req.body.expireDate,
        active: req.body.active
    }

    if (req.file) bidData.image = req.file.path;

    bidData.location = {
        type: "Point",
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)]
    };
    Bid.findByIdAndUpdate(req.params.id, { $set: bidData }, { runValidators: true })
        .then((bid) => {
            if (bid) {
                res.redirect('/bids');
            } else {
                next(createError(404, 'bid does not exists'));
            }
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                const bid = req.body;
                bid.id = req.params.id;
                res.render('bids/edit', {
                    errors: error.errors,
                    bid: bid,
                });
            } else {
                next(error);
            }
        });
};

module.exports.delete = (req, res, next) => {
    Bid.findByIdAndDelete(req.params.id)
        .then((bid) => {
            if (bid) {
                res.redirect('/bids');
            } else {
                next(createError(404, 'Bid does not exists'));
            }
        })
        .catch(next);
};