// // const fs = require("fs");
// const path = require("path");
// const Cart = require("../models/cart");
// const db = require("../util/database");

// // const p = path.join(
// //   path.dirname(require.main.filename),
// //   "data",
// //   "products.json"
// // );

// // const getProductsFromFile = (cb) => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     (this.id = id), (this.title = title);
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     // getProductsFromFile((products) => {
//     //   if (this.id) {
//     //     const existingProductIndex = products.findIndex(
//     //       (prod) => prod.id === this.id
//     //     );
//     //     const updatedProducts = [...products];
//     //     updatedProducts[existingProductIndex] = this; // This refers to updated products
//     //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     products.push(this);
//     //     fs.writeFile(p, JSON.stringify(products), (err) => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });
//     return db.execute(
//       "INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//   }

//   static deleteById(id) {
//     // getProductsFromFile(products => {
//     //   const product = products.find(prod => prod.id === id);
//     //   const updatedProducts = products.filter(prod => prod.id !== id);
//     //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//     //     if (!err) {
//     //       Cart.deleteProduct(id, product.price);
//     //     }
//     //   });
//     // });
//   }

//   static fetchAll() {
//     // getProductsFromFile(cb);
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     // We have an array of objects
//     // The function here is the cb of getProductsFromFile which takes an argument called products
//     // This argument can either be [] or the json.parse()
//     // getProductsFromFile((products) => {
//     //   const product = products.find((p) => p.id === id);
//     //   cb(product);
//     // });
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//   }
// };

const Sequalize = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequalize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequalize.STRING,
  price: {
    type: Sequalize.DOUBLE,
    allowNull: false,
  },
  imageUrl: { type: Sequalize.STRING, allowNull: false },
  description: { type: Sequalize.STRING, allowNull: false },
});

module.exports = Product;
