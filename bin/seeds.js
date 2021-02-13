const mongoose = require('mongoose');
//const Bid = require('../models/bid.model');
//const Comment = require('../models/comment.model');
const Product = require('../models/product.model')
    //const bidsData = require('../data/bids.json');
const productData = require('../data/products.json');

require('../config/db.config');

/*
mongoose.connection.once('open', () => {
  console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);
  mongoose.connection.db.dropDatabase()
    .then(() => console.log(`- Database dropped`))
    .then(() => Bid.create(bidData))
    .then(bids => {
      console.info(`- Added ${bids.length} bids`);
      const bidsComments = bids.map(bid => {
        const comments = bidData.find(p => p.title === bid.title)
          .comments
          .map(comment => {
            comment.bid = bid.id;
            return comment;
          });
        return Comment.create(comments)
          .then(comments => console.info(`- Added ${comments ? comments.length : 0} comments to bid ${bid.title} [${bid.id}]`))
      });

      return Promise.all(bidsComments);
    })
    .then(() => console.info(`- All data created!`))
    .catch(error => console.error(error))
    .then(() => process.exit(0))
})
*/

mongoose.connection.once('open', () => {
    console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);
    mongoose.connection.db
        .dropDatabase()
        .then(() => console.log(`- Database dropped`))
        .then(() => Product.create(productData))
        .then(products => {
            console.info(`- Added ${products.length} products`);
        })
        .then(() => console.info(`- All data created!`))
        .catch(error => console.error(error))
        .then(() => process.exit(0))
})