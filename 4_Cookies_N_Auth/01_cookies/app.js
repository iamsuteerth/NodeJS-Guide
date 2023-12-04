const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session); // Pass your session object

const pswd = encodeURIComponent("REDACTED");
const uri = `REDACTED`;
const uri_connection_string = `REDACTED`;

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri:uri_connection_string,
  collection:'sessions',
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// resave option - session wont be saved on every request sent but only when something changed
// ensure that no session is saved for a request where nothing had to be saved
app.use(
  session({
    secret: "qwertyuiopasdfghjklzcvbnm",
    resave: false,
    saveUninitialized: false,
    store:store,
  })
);

app.use((req, res, next) => {
  User.findById(req.session.user?._id)
  .then((user) => {
    if(user){
      req.user = user;
    }
    next();
  })
  .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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
