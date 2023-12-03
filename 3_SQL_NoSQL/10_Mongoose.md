# Mongoose

This is like sequalize for mongodb

<a href="https://github.com/iamsuteerth/NodeJS-Guide/tree/main/3_SQL_NoSQL/03_mongoose/shop_project"> Project so far with explanation</a>

The previous sequalize and vanilla mongo db connection is also provided here in the comments

<a href="https://github.com/iamsuteerth/NodeJS-Guide/tree/main/3_SQL_NoSQL/03_mongoose/vanilla_shop_project"> Only Code </a>

Mongoose is an `Object Document Mapping Library` or ODM

## Core concepts

- Schemas and models
  - e.g. User, Product
- Instances
  - const user = new User();
- Queries
  - User.find()

## .populate()

```js
Product.find().populate("userId.<path>").then().catch();
```

```js
// Select required data
Product.find().select("title price -_id");
```

```js
const products = user.cart.items.map((i) => {
  return { quantity: i.quantity, prodduct: { ...i.productId._doc } };
});
```

We can access this here because product ID actually will be an object with a lot of metadata attached to it even though we can't directly see that when console logging but with .doc we get really access to just the data that's in there and then with the spread operator inside of a new object, we pull out all the data in that document we retrieved and store it in a new object which we save here as a product.
