const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongoDb.ObjectId(id) : null;
    this.userId = userId;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findProductById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongoDb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log);
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(prodId) })
      .then((_) => console.log("deleted"))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
