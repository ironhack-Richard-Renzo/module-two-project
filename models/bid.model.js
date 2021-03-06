const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: 'https://antitrustlair.files.wordpress.com/2013/02/post_danmark.jpg?w=420&h=279',
    },
    price: {
        type: String,
        default: null
    },
    author: {
        type: String,
        ref: 'User',
        default: null
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    web: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'            
        },
        coordinates: [Number]
    },
    expireDate: {
        type: Date,
        default: null
    },
    active: {
        type: String,
        default: null
    }
});

bidsSchema.index({ location: '2dsphere' });

const Bid = mongoose.model('Bid', bidsSchema);

module.exports = Bid;