Everyone has a basic idea of how authentication works

1. Login reqest
2. Session created and stores info that is authenticated
3. Cookie is set which stores session id

## NOTE

You should ALWAYS make sure that the passwords in your DB are not saved as PLAINTEXT as its a HUDE security flaw if the DB gets leaked.

This can be done with `npm install --save bcryptjs`

# CSRF Attacks

Cross Site Request Forgery

Where the attacker takes advantage of the fact that you are logged in and manipulates you into doing something you never intended to do.

The protection is to make sure that the users only interact with OUR views.

This can be used for protection `npm install --save csurf`

For ANY non-get request, the package looks for a csrf token

In practice you should now choose a different package <a href="https://www.npmjs.com/search?q=express%20csrf">express csrf</a>. You may, for example, consider using this package (which has a different API than csurf()): <a href ="https://www.npmjs.com/package/csrf-csrf">csrf-csrf</a>

# Data storage across redirects

Now, let's say a user enters incorrect credentials, we want to redirect the user with an error message but how will we distinguish between a vanilla login post sequence OR this redirect one?

We need to use sessions but not permanently store data either

`npm install --save connect-flash`

```js
req.flash("error", "Invalid email or passwod");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};
```

# Summary

## Authentication

- Authentication means that not every visitor of the page can view and interact with everything
- Authentication has to happen on the server side and build up sessions
- You can protect routes by checking the session controller login status right before you access a controller action

## Security and UX

- Passwords should be encrypted
- CSRF attacks are a real issue and you should therefore include CSRF protection in ANY application you build.
- For a better user experience, you can flash data/messages into the session which you then can display in your views

# Sending Emails

You don't really create a mail server. Its really complex.

Node Server -> Mail Server (3rd Party Service) -> User

<div align="center">
  <a href="https://nodemailer.com/about/">Nodemailer Official Docs</a>

`npm install --save nodemailer nodemailer-sendgrid-transport`

<a href="https://sendgrid.com/docs/">SendGrid Official Docs</a>

</div>

## Sample Code

```js
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// Setup
const transporter = nodemailer.createTransport(sendgridTransport({
  auth : {
    api_user : <>,
    api_key : <>,
  }
}));

// In postLogin
return transporter.sendMail({
  to: email,
  from: <>,
  subject: <>,
  html: <>,
});
// Don't have this in a blocking way for large scale apps as it can cause slowdowns and consider some other solution
```

# Advanced Authorization

- Resetting Passwords
  - Tokens can be used to prevent users from resetting random user accounts which have to be unique and short lived
- Authorization over actions
  - Not all authenticated users should be able to do EVERYTHING. Lock down access by restricting permissions of your users

Include a link in the token when the user requests a password reset to make sure its them

## Validation

- Validation can be done client side (which is a good to have but not enough as users can simply disable javascript and get around it)
- Its best to have server sided validation

```js
// In app.js
router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email!"),
  authController.postSignup
);

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(422).render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: errors.array()[0].msg,
  });
}
```

```
npm install --save express-validator
```

### Custom errors

```js
.withMessage().custom((value, {req}) => {
  if(<cond>)
    throw new Error
})
```

You can chain multiple validators too!

If you want custom error messages but for all validators, just include it in the first function like `check()`

## Async Validation

```js
.custom((value, {req}) => {
  return User.findOne({ email: email })
    .then(userDoc => {
      if(userDoc){
        return Promise.reject('Custom promis error message');
      }
    })
});
```
If nothing is returned, then its accepted, otherwise as an error.
