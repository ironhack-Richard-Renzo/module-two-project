const faker = require('faker');

const products = [{
    "name": faker.commerce.productName,
    "image": faker.commerce.product,
    "description": faker.commerce.productDescription,
    "prices": [faker.commerce.price, faker.commerce.price, faker.commerce.price],
    "webs": [faker.internet.url, faker.internet.url, faker.internet.url],
    "category": faker.commerce.department
}];

module.exports = products;