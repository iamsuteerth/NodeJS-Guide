const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const pswd = encodeURIComponent("REDACTED");
const uri = `mongodb+srv://suteerth:${pswd}@cluster0.4gsxvel.mongodb.net/shop?retryWrites=true&w=majority`;

const errorController = require("./controllers/error");
const User = require("./models/user");
// const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // // User.findByPk(1)
  User.findById("656b05adf2255da5d7595283")
    .then((user) => {
      // req.user = user; // sequalize object is stored here
      // req.user = new User(user.name, user.email, user.cart, user._id);
      req.user = user;
      // To work with the user model
      console.log(user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(uri)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Suteerth",
          email: "test@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3001);
  })
  .catch((err) => console.log(err));

// mongoConnect((client) => {
//   app.listen(3000);
// });
