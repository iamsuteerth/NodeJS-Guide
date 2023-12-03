# mongoDB
- Store and work with lots of data
- Schemaless
 Collections -> Documents

JSON format used (BSON actually used behind the scenes)

There can be some replication but that makes queries VERY fast

```
There are TWO versions of the finished app. One has the commented code from sequalize, other one is pure mongoDB. Use these for reference
```

## How to connect
```js
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://suteerth:<March@password>@cluster0.4gsxvel.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("init success");
      callback(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
```
## Refer to the mongoDB docs for details on CRUD ops

## Connecting to the DB without multiple connections
```js
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://suteerth:<March@123>@cluster0.4gsxvel.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("init success");
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if(_db){
    return _db;
  }
  throw 'No db found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
```

## Fetching all products
```js
static fetchAll(){
    return db.collection('products').find().toArray();
}
```
Not recommended for large datasets
## Fetching ONE Product
```js
static findProductById(id) {
  const db = getDb();
  return db
    .collection("products")
    .find({ _id: prodId })
    .next()
    .then((product) => {
      console.log(product);
      return product;
    })
    .catch((err) => console.log);
}
```
MongoDB uses `_id` instead of id so do make sure to change it in ejs files to avoid errors. Also the `_id` is of type object id which cannot be simply compared with the id string

## Updating a product 
```js
save() {
  const db = getDb();
  let dbOp;
  if (this._id) {
    dbOp = db
      .collection("products")
      .updateOne({ _id: new mongoDb.ObjectId(this._id) }, { $set: this });
  } else {
    dbOp = db.collection("products").insertOne(this);
  }
  return dbOp
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}
```
Here we store the promise returned in dbOp and then call a common then function so to speak.
$set is a special keyword which can be followed by a map in case you want to manually update something. `this` refers to the updated object in its entirety.

## How to avoid `.id` errors?
```js
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
// ObjectId(id) will yield the id data type where it is called since the normal string is not acceptable for mongoDB
```

We can get rid of `cart-items` and the model because there is a ONE to ONE relation between the user and cart

## A quick side note
There can be a scenario where the cart item has invalid data. Such as when a product is de-listed. For such cases, there can be lambda functions running which check for such irregularities in the cart and take care of them OR you could detect these through "cart size" manipulation when calling the getCart() method sometime in the future