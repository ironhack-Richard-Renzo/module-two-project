const faker = require('faker');
const stock = 5;
const products = [];

for (let index = 0; index < stock; index++) {

    let name = faker.commerce.productName;
    let product = faker.commerce.product;
    let description = faker.commerce.productDescription;
    let price = faker.commerce.price;
    let url = faker.internet.url;
    let category = faker.internet.url;

    products.push({
        "name": name,
        "image": product,
        "description": description,
        "prices": [price],
        "webs": [url],
        "category": category
    });
}

module.exports = products;