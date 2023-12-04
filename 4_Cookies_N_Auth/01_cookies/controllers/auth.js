const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = false;
  // console.log(isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true");
  User.findById("656b05adf2255da5d7595283")
    .then((user) => {
      // req.user = user;
      req.session.user = user;
      req.session.isLoggedIn = true; // A session cookie hashed using the secret key
      req.session.save((err) => {
        if (err) console.log(err);
        res.redirect("/");
      }); // Make sure that session was created before continue
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
