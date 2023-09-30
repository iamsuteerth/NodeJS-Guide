# What is ExpressJS?
It can be quite cumbersome to work just with NodeJS as you have to deal with a lot of code to handle basic things such as parsing the body which shouldn't be your concern as you should be focused more on your own business logic.

`This is a 3rd party framework which allows you to outsource a lot of nitty gritty code.`

## What and Why
> Server logic can be quite complex as a lot of work had to be done just to parse get and post requests.
>
> You want to focus on your business logic and not on the nitty gritty details.
>
> A framework is a set of helper functions but also a suite of tools and rules which help you build your application.

## Alternatives to ExpressJS
> Vanilla JS

> Adonis JS

> Koa

> Sails JS

etc.

Express JS is very flexible and extensible and a lot of 3rd party packages available for it.

## How to install express js?
```js
// This will be a production dependency and will be shipped with the project
npm install --save express 
// Globally
npm install -g express
```

## Basic usage
```js
const express = require('express');
const app = express();
```

Express JS is all about middleware.

Request -> Middleware (next()) -> Middleware (res.send()) -> Reponse

`Adding Middleware`
```js
// Add new middleware function
// Executed for every request
// Next is a function which will be passed to the function inside use
app.use((req, res, next) => {
    console.log('In the middleware');
    next();
    // Necessary to go onto next middleware
});
app.use((req, res, next) => {
    console.log('In another middleware');
});
```
Sending responses gets easier thanks to ExpressJS
```js
app.use((req, res, next) => {
    console.log('In another middleware');
    res.send('<h1> Hello from Express </h1>');
    // Send methods by default sends text html
});
```
`We can shorten the createServer and listen method to just this`
```js
app.listen(3000);
```
### Handling routes using ExpressJS
```js
app.use('/', (req, res) => {}); // The '/' is the default
```
This will work for all URLs beginning with `/`
```js
app.use('/add-product', () => {});
app.use('/', () => {});
```
Now here, `add-product` once handled wont go to `/` because we haven't used the `next()` function.

Just the way we handled routing in vanilla node js, i.e. we didn't want to send multiple responses, it's what we are doing here as well.

## Parsing incoming requests using ExpressJS
This example will make it clear
```js
app.use('/add-product',(req, res, next) => {
    console.log('Add product middleware');
    res.send('<form action = "/product" method="POST"><input type = "text" name="message"><button type = "Submit"> Add Product </button></form>');
});
app.use('/product', (req, res, next) =>{
    console.log(req.body);
    res.redirect('/');
    // Convenience function added by express
});
app.use((req, res, next) => {
    console.log('In another middleware');
    res.send('<h1> Hello from Express </h1>');
});
```
We get an undefined for `req.body` is because req by default doesn't parse the body. We're going to need this:
```js
npm install --save body-parser
```
Now this is bundled with ExpressJS but it may get removed so its better to have it included this way.
### Usage
```js
// This is to be kept at the top of your code because we want this to be executed by default and this is also registered as a middleware
app.use(bparser.urlencoded());
```
The manual parsing doesn't need to be done. This won't parse things like files but for those we can use different parsers and this plugin functionality is what makes expressjs so extensible.

The body parser returns a key value pair so extraction of data also becomes quite easier.

You can have middlewares only for GET requests by using `.get()` instead of `.use()` or `.post()`

`delete`, `patch` and `put` can also be used here

# Routers
Files can get quite big so it's better to outsource our ROUTING code which can be done quite easily using express, typically in `routes` folder.

> Since we've been sort of building an online shop. The first route file can be `admin.js` as this is the route which will handle creation of products which the admin of the shop can do.
>
> Then we can have a `user.js` for the users.
## How to setup router?
```js
const express = require('express');
const router = express.Router();
module.exports = router;
```
Now, the order of the adminRoutes and shopRoutes doesn't matter when we specify the request type instead of using `use`, say `get` and `post`.

## 404 Error Page for wrong requests
Whenever the user enters something wrong in the address, we need to return a 404 page, you could also create a custom page where all the wrong addresses are routed to.
```js
app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});
```
## Filtering Paths
There can be different page responses for the same path. Such as `admin/` for `get` and `post` requests.

```js
app.use('/admin', adminRoutes);
```
Then in the adminRoutes, `/admin` is like default.

We can put a common starting segment so that we don't have to repeat in the router files.

## HTML pages 
We manage our `views` in one place in the views folder. They are just a bunch of html files which we serve to users.

### NOTE: I am not covering HTML or CSS in this guide 

We can send files as response to the user. It by default sets the content type as ResponseHeaderField.

Now in order to specify the path to the file, we need to provide the absolute path.

`./` refers to root of our OS. Thus we need to use `path` core module.

```js
res.sendFile(path.join(__dirname, 'views', 'shop.html'));
```
This should be done but the `__dirname` points to the routes folder, not the views folder where our files are actually located.

Therefore, we need to use this like this.
```js
res.sendFile(path.join(__dirname, '../' ,'views', 'shop.html'));
```

### Helper Functions
A cleaner approach to get to the root directory.
```js
// In utils folder
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
// Refer to main module created because of which our app is running
```
## Styling (CSS Guide not PRESENT)
All the styles are defined in html files, but we can export that functionality to css. We can't just import them. A `public` folder is used to hold content exposed to public crowd. Now we need to access the file system for this which is not possible the normal way. For this, express offers a functionality by serving files statically.

This provides read access to the files in the folder mentioned
```js
app.use(express.static(path.join(__dirname, 'public')));
```
Any request which tries to find a `.css` or `.js` file will be forwarded to the middleware handling them and take it to the folder specified.
```css
<link rel="stylesheet" href="/css/main.css">
```
You can have multiple handlers and all will be funneled until a hit occurs.

# Summary
## What is Express.JS ?
> It is a Node.js framework - a package that adds a bunch of utility functions and tools and a clear set of rules on how the app should be built (middlewares)

> Highly extensible and other packages can be plugged into it

## Middleware, res() and next()
> Express relies heavily on middleware functions which can be called by using `use()`

> Middleware functions handle a request and should call `next()` to forward the request to next function in line or send a response

## Routing
> You can filter requests by path and method

> If you filter by method, paths are matched exactly, otherwise the first segment of url is matched

> You can use `express.Router` to split your routes across files elegantly

## Serve Files
> You can `sendFile()` to your users

> If a request is directly made for a file like `.css`, you can enable static serving for such files via `express.static()`