const crypto = require("crypto");
const { validationResult } = require("express-validator");
const bc = require("bcryptjs");

const User = require("../models/user");

const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9734a2f547be22",
    pass: "79bd93887b0969",
  },
});

exports.getLogin = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg;
  } else {
    msg = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: msg,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg;
  } else {
    msg = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: msg,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or passwod");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: errors.array()[0].msg,
          oldInput: { email, password },
          validationErrors: [],
        });
      }
      bc.compare(password, user.password)
        .then((isMatched) => {
          if (isMatched) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg,
            oldInput: { email, password },
            validationErrors: [],
          });
        })
        .catch((err) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
      validationErrors: errors.array(),
    });
  }
  const hashedPswd = await bc.hash(password, 12);
  const user = new User({
    email: email,
    password: hashedPswd,
    cart: { items: [] },
  });
  user
    .save()
    .then((result) => {
      transport.sendMail({
        to: email,
        from: "shop@node-complete.com",
        subject: "Signup Successful!",
        html: "<h1>You have successfully signed up!</h1>",
      });
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg;
  } else {
    msg = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: msg,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("reset");
    }
    const token = buffer.toString("hex");
    const email = req.body.email;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transport.sendMail({
          to: email,
          from: "shop@node-complete.com",
          subject: "Password Reset",
          html: `
          <p>You requested a password reset.</p>
          <p> Click this <a href="http://localhost:3001/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let msg = req.flash("error");
      if (msg.length > 0) {
        msg = msg;
      } else {
        msg = null;
      }
      if (!user) {
        req.flash("error", "Invalid user for password reset");
        return res.redirect("/reset");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: msg,
        userId: user._id,
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const uid = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;
  if (newPassword != confirmPassword) {
    req.flash("error", "Passwords don't match");
    res.redirect(`/reset/${token}`);
  }
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: uid,
  })
    .then((user) => {
      resetUser = user;
      return bc.hash(newPassword, 12);
    })
    .then((result) => {
      resetUser.password = result;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((_) => {
      transport.sendMail({
        to: req.body.email,
        from: "shop@node-complete.com",
        subject: "Reset Successful!",
        html: "<h1>You have changed password!!</h1>",
      });
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
