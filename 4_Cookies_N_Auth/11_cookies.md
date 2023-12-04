# What are cookies?

In a typical workflow such as login. We send a request for logging in and the server sets cookie via a response header. This cookie is used for telling the user that he is logged in which is stored in the browser and can be then used in subsequent requests to tell the server that the user is logged in.

Now in our project, the middlewares are run for ALL the requests which is why the first middlewhere fetching the user always runs and thus we have the user object throughout the request.

## How to set cookie and extract data?

```js
res.setHeader("Set-Cookie", "loggedIn=true");
const isLoggedIn =
  req.get("Cookie")?.split(";")[0].trim().split("=")[0] === "true";
```

## Cookies and tracking

A cookie can also be sent to another page and that is a common instrument in tracking where you have thatso-called `tracking pixel` on pages which is simply an image url with no real image but that image can be located on let's say Google's servers. Say you have a cookie on that page which is also sent along...

Therefore Google can track on which page you are and how you are moving through the web even if you're not on their websites because some data is stored in your client and obviously you could delete it therefore which is why you can block such mechanisms too but it is stored there and it is sent with every request to Google, so they can track you without you being on their servers, so storing that information on their servers would not work but storing it on your computer will work
because obviously that can be sent on every page you visit.

You can set various headers such as `Secure;`, `HttpOnly;` (Which allows only HTTP requests not allowing client side JS protecting aganist XSS attacks), `Expires=<HTTPDATE>`, `Max-Age=<Seconds>` etc.

# What are sessions

`Sessions are stored server side`

It is a construct where we can store data like whether the user is logginIn or not. We dont store it in a variable nor in the request, we only want to share the information across all requests of the same user.

We do this by using a cookie to have session id which is the hashed version of the session. Now, if the user changes it, we will know about it as the hash value would change.

A third party `express-session` is needed for this.

```js
app.use(
  session({
    secret: "qwertyuiopasdfghjklzcvbnm",
    resave: false,
    saveUninitialized: false,
  })
);
/* ----------------- */
res.session.isLoggedIn = true; // A session cookie hashed using the secret key
```
We are storing the session cookie in memory which can be a bad idea for production.

For storing in DB (mongodb in our case)
```js
const MongoDBStore = require('connect-mongodb-session')(session); // Pass your session object
const store = new MongoDBStore({
  uri:uri_connection_string,
  collection:'sessions',
});
app.use(
  session({
    secret: "qwertyuiopasdfghjklzcvbnm",
    resave: false,
    saveUninitialized: false,
    store:store,
  })
);
```
Just like this, data is stored in our database.

```js
req.session.save((err) => {
  if (err) console.log(err);
    res.redirect("/");
}); // Make sure that session was created before continue
```

# Some differences
| Cookies                                                                                          | Sessions                                                                                                          |
|--------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Great for storing data on the client (browser)                                                   | Stored on the server                                                                                              |
| Don’t store sensitive data here as it can be viewed and manipulated                              | Can store anything in here                                                                                        |
| Can be configured to expire when browser ("session cookie") is closed or when at expiry date/age | Often used for storing user data/auth status and identitfied by a cookie (not to be confused with session cookie) |
| Works well together with sessions                                                                | Different storages can be used for saving your sessions on the server                                             |