const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items : []}
    this._id = id;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new mongoDb.ObjectId(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log);
  }
  addToCart(product) {
    let cartProductIndex = this.cart?.items?.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    cartProductIndex = cartProductIndex ?? -1;
    let newQuantity = 1;
    // Copy cart items into a variable
    const updatedCartItems = [...this.cart?.items];
    // Either just update the quantity OR push a new object
    // Update if index is found
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        // Array of products fresh from database
        return products.map((p) => {
          // For each product p
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
    // Takes an array of id and all ids are accepted based on condition
    return this.cart;
  }
  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    // First add the cart to orders
    const db = getDb();
    return (
      this.getCart()
        .then((products) => {
          const order = {
            items: products,
            user: { _id: new mongoDb.ObjectId(this._id), email: this.email },
          };
          return db.collection("orders").insertOne(order);
        })
        // Here redundant data doesn't matter that much as the ordered price doesn't need to be in sync with current price
        // Clear the cart in user collection
        .then((result) => {
          this.cart = { items: [] };
          return db
            .collection("users")
            .updateOne(
              { _id: new mongoDb.ObjectId(this._id) },
              { $set: { cart: { items: [] } } }
            );
        })
    );
  }
  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongoDb.ObjectId(this._id) })
      .toArray();
  }
}
module.exports = User;
