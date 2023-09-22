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