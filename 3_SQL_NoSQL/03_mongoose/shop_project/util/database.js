// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const pswd = encodeURIComponent("REDACTED");
// const uri = `mongodb+srv://suteerth:${pswd}@cluster0.4gsxvel.mongodb.net/shop?retryWrites=true&w=majority`;
// let _db;
// const mongoConnect = (callback) => {
//   MongoClient.connect(uri)
//     .then((client) => {
//       console.log("init success");
//       _db = client.db();
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No db found";
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
