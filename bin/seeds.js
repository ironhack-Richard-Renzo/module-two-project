const mongoose = require('mongoose');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Product = require('../models/product.model')
const postData = require('../data/posts.json');
const productData = require('../data/fake-products');

require('../config/db.config');

/*
mongoose.connection.once('open', () => {
  console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);
  mongoose.connection.db.dropDatabase()
    .then(() => console.log(`- Database dropped`))
    .then(() => Post.create(postData))
    .then(posts => {
      console.info(`- Added ${posts.length} posts`);
      const postsComments = posts.map(post => {
        const comments = postData.find(p => p.title === post.title)
          .comments
          .map(comment => {
            comment.post = post.id;
            return comment;
          });
        return Comment.create(comments)
          .then(comments => console.info(`- Added ${comments ? comments.length : 0} comments to post ${post.title} [${post.id}]`))
      });

      return Promise.all(postsComments);
    })
    .then(() => console.info(`- All data created!`))
    .catch(error => console.error(error))
    .then(() => process.exit(0))
})
*/

mongoose.connection.once('open', () => {
    console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);
    mongoose.connection.db.dropDatabase()
        .then(() => console.log(`- Database dropped`))
        .then(() => Product.create(productData))
        .then(products => {
            console.info(`- Added ${products.length} products`);
        })
        .then(() => console.info(`- All data created!`))
        .catch(error => console.error(error))
        .then(() => process.exit(0))
})