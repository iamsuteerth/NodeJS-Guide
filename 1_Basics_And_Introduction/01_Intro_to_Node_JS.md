# What is Node JS
Node JS is a javascript runtime. Which is used to manipulate the pages in browsers. JS runs in the browser.
> Node JS is like a different type of JS putting it in a different environment allowing you to run JS in other places as well.
>
> Node JS can be used to run JS outside the browser

## V8 
This is the JS engine built by google which runs JS in the browser. As an engine, it takes JS code and compiles into machine code.

NodeJS -> V8 (Made in C++) -> Machine Code

NodeJS adds features such as interacting with your file system

In a nutshell, NodeJS allows you to run JS on your computer and allows you to have enhanced functionality

```js
Ctrl C + Ctr C to exit node console
```

### File System Funtionality
```js
const fs = require('fs');
fs.writeFileSync('hello.txt', 'Hello from Node JS');
console.log('Hello World');
```

## How JS on server works
User sends a request to the server and the server responds with an HTML Page/CSS/JS code (for the browser)

- User authentication, Database, Input Validation, Business Logic 

This is where NodeJS comes into play, using JS to run server side code.

## Role in web development
> Run Server
>> Create server and listen to incoming requests
>
>> Tools like Apache and Nginx which the servers and listen to incoming requests and execute php code. NodeJS does all that and more
>
> Business Logic
>> Handle Requests, Validate Input and Connect to the database
>
> Responses
>> Return responses such rendered HTML, JSON etc.

### Alternatives to NODEJS
Python (Flask), Django

PHP with framework like laravel

### Advantage of NodeJS
-> **Usage of JS** : Which is an easy widely used language

## REPL
> R -> Read
>> Read User Input
>
> E -> Eval
>> Evaluate User Input
>
> P -> Print
>> Print Output
>
> L -> Loop
>> Wait for new input

This is what we use if we just type *node* in a terminal

Great Playground