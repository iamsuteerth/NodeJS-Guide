const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // Pass your session object
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const pswd = encodeURIComponent("REDACTED");
const uri = `mongodb+srv://REDACTED:${pswd}@cluster0.REDACTED.mongodb.net/shop?retryWrites=true&w=majority`;
const uri_connection_string = `mongodb+srv://REDACTED:${pswd}@cluster0.REDACTED.mongodb.net/shop`;

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: uri_connection_string,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-'));
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, true);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
// resave option - session wont be saved on every request sent but only when something changed
// ensure that no session is saved for a request where nothing had to be saved
app.use(
  session({
    secret: "qwertyuiopasdfghjklzcvbnm",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; // Set local variables (only exist in views)
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use("/500", errorController.get500);
app.use(errorController.get404);
// All error handling middlewares come here and are run in order
// app.use((error, req, res, next) => {
//   res.status(500).render("500", {
//     pageTitle: "Some error ocurred!",
//     path: "/500",
//     isAuthenticated: req.isLoggedIn,
//   });
// });
mongoose
  .connect(uri)
  .then(() => app.listen(3001))
  .catch((err) => console.log(err));
