const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: 'Product name is mandatory',
        trim: true,
    },
    description: String,
    image: {
        type: String,
        default: 'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png'
    },
    price: Number,
    webs: {
        type: [String],
        default: null
    },
    category: {
        type: String,
        required: 'Product category is mandatory',
        enum: ['Mobile', 'Clothes', 'Home', 'Tools', 'Videogames']
    },
    brand: {
        type: String,
        default: null
    }
});

productSchema.pre('save', function(next) {
    next();
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;