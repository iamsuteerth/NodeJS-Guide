# How the web works?

## P.S This guide part is a bit theoretical

User/Client - (enters) -> Website

Website - (DNS) -> Server 

The user indirectly sends a request to the server. Here is where NodeJS comes into play, i.e. our code runs on the server.

Quick Recap of the things you can do 

> User input validation
>
> Communicating with DB
>
> Other business logic
>
> Sending back responses such as HTML Pages

These reponses are sent following set of rules (HTTP and HTTPS)

### HTTP 
Hyper Text Transfer Protocol
### HTTPS
Hyper Text Transfer Protocol Secure
```
SSL or Secuer Sockets Layer Encryption is performed here.
```
# Creating a Node Server
Standard procedure is to start off with an "app.js" file which is like main.dart in futter. The starting point!

### Core Modules
> http
>> Launch a server and send requests (sending requests through google maps API to Google Maps' server and getting the response)

> https
>> Launch SSL encoded servers

> fs
 
> path
>> Constructing file paths which work on ALL OSs

> os

Some imports need to be done first 
```js
const http = require(http);
// You can also import your own files
http.createServer();
// A lot of functions can be accessed following the . operator

// A simple server not giving any response
const server = http.createServer((req, res) => {
    console.log(req);
});
server.listen(3000);
```
Now what happens in the background after calling the .listen() function is that an event loop starts running which is managed by NodeJS which runs as long as listeners are registers

Our core functionality is achieved by .listen()

Now, the entire process is run as a single thread.

Req is a very complex object with headers (metadata)z
```
Ctrl + C is how you exit in terminal if you start an event loop through node
```
## Understanding Requests
Important fields in req
```js
req.url, req.method, req.headers
```
> Get is the default method used when you enter a URL.
### Understanding Responses
> You can write data in response like this 
```html
res.write('<html>');
res.write('<head><title>My Home</title></head>');
res.write('<body><h1> Hello from Node JS </h1> </body>');
res.write('</html>');
```
Now you can do a lot more than just this.
Consider this snippet
### Routing Requests
```js
const url = req.url;
if (url === '/'){
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action = "/message" method="POST"><input type = "text" name="message"><button type = "Submit"> Send </button></form></body>'); 
    // Automatically the form sends us the filled input via the name "message" so the name can be really anything
    res.write('</html>');
        // This return is necessary to not execute the code written below
    return res.end();
}
```
### Redirecting Requests
```js
if(url === '/message' && method === 'POST'){
    res.writeHead(302, {'Location' : '/'});
    // 302 is status code for redirection
    // Or res.statusCode = 302 ; res.setHeader('Location', '/');
    return res.end();
}
```
Location is another default header accepted by the browser.
## Parsing the data we get from requests
The incoming data is sent as a STREAM of data which JS in general knows but NodeJS uses a lot
### Buffers
Stream -> Req Body Pt. 1 -> Req Body Pt. 2 -> Req Body Pt. 3 -> Req Body Pt. 4 -> Fully Parsed

A buffer is like a bus stop which allows "customers" to board it. It is simply a construct which allows you to hold multiple chunks and work with them before they are released.

How to do this?
```js
if(url === '/message' && method === 'POST'){
    const body = [];
    req.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
    });
    // Once all data has been streamed
    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        console.log(parsedBody);
    })
    // We concatinate them into parsedBody
    // Function for every data
    // Listening for data event
    return res.end();
}
```
Output is something like<br>
`< Buffer 6d 65 73 73 61 67 65 3d 68 65 6c 6c 6f >`<br>`message=hello`

Now what happened here is because our form field was named as message, and I entered hello in the field, we see message=hello.

The form compiles all the userInput data in key value pairs and sends it through the POST method.

Now this can be a little bit intimidating but ExpressJS takes care a lot of it and even this is a lot of basic code just put together into something functional.

It is like writing `.asm` code to do something. It looks complex but in reality, it isn't.

``
Now the order of execution of code is not the order in which you write it.
``
For example,
```js
fs.writeFileSync('message.txt', `${message}`);
res.writeHead(302, {'Location' : '/'});
```
The writeFileSync is actually executed AFTER writeHead

So while the listener is doing it's job, the response is already sent. Which is the wrong way of handling responses.

Look at this
```js
if(url === '/message' && method === 'POST'){
    const body = [];
    req.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
    });
    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        fs.writeFileSync('message.txt', `${message}`);
        res.statusCode = 302;
        res.setHeader('Location', '/'); 
        // Instead of writeHeader
        return res.end();
    });
};
res.setHeader('Content-Type' , 'text/html');
res.write('<html>');
res.write('<head><title>My Home</title></head>');
res.write('<body><h1> Hello from Node JS </h1> </body>');
res.write('</html>');
res.end();
```
If we keep the logic like this, then we can't really do anything as a response is already sent and we get an error `Cannot set headers after they are sent to the client`

Now the functions passed onto methods like createServer() are executed asynchronously.

In such cases, node doesn't immediately execute the function in function and sets up listeners internally. For the `end` event, when it is done parsing it, node calls that function for you. Node has interal registry of events and listeners to these events.

>When Node.js is done parsing your request, it will go through that registry and see that its done with the request and it should now send the end event.

> It checks for the listeners

> And then it will find functions you might have registered for that and then call them. 

However, code execution is not stopped while this happen
```js
// One solution is 
return req.on('end', () => {
    const parsedBody = Buffer.concat(body).toString();
    const message = parsedBody.split('=')[1];
    fs.writeFileSync('message.txt', `${message}`);
    res.statusCode = 302;
    res.setHeader('Location', '/'); 
    // Instead of writeHeader
    return res.end();
});

// Rest of the code
```
### Write File Sync 
This is a special function that stops execution of next line of code until the file is created

New requests won't be handled until the file operation finishes. It can be used in this case as the file operation is VERY small.

```js
// Alternatively
fs.writeFile('message.txt', message_to_write, (err) => {});
```
So what will happen here is an event listener will be created automatically behind the scenes

NodeJS essentially tells the OS to do things which is multi - threaded and this a smooth continous event loop can run.

## How NodeJS remains performant?
> NodeJS uses a single JS thread.

> NodeJS event loop handles all the event callbacks (functions we created in servers)

> Long time taking operations send them to a Worker Pool which does all the heavy lifting.
>> It can create different threads working in conjunction with the OS and its detached from your code.

> Once the worker is done, it then triggers a callback which is handled by the event loop.

> There is a certain order for the execution of callbacks. At every iteration, it checks for timer callbacks which have 
`setTimeout` and `setInterval` callbacks
>
> Then it executes pending callbacks such as I/O related deferred callbacks. If there are too many callbacks like these, it can also delay them till next iteration.
>
> Then we have the `poll` phase where it looks for new IO events and execute their callbacks if possible, otherwise defer them. It can also jump back to the `timer` phase.
>
> Then we have the `check` callbacks `setImmediate()` callbacks.
>
> Now close event callbacks are executed
>
> Exit if there are no event listeners (procces.exit)

Here is a graph

Timers -> Pending Deffered (IO) callbacks -> Poll (Get new IO) -> Check -> Close Callback -> Exit

## Optimizing our app.js demo file a bit
New commands and methods
```js
// node will essentially check if something was exported when we include the file : if we use this
module.exports = requestHandler;
// OR
module.exports = {
    handler: requestHandler,
    someText: 'Text',
}
// OR
module.exports.handler = requestHandler;
module.exports.someText = 'text';
// OR
exports.handler = requestHandler;
exports.someText = 'text';
```
`app.js`
```js
const http = require(http);
const routes = require('./routes');
const server = http.createServer(routes);
// To pass the function asking node to execute it on every request
server.listen(3000);
```
`routes.js` 

Should be in the same directory for the above relative path to work
```js
const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action = "/message" method="POST"><input type = "text" name="message"><button type = "Submit"> Send </button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', `${message}`, err => {
                res.writeHead(302, { 'Location': '/' });
                return res.end();
            });
        })
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My Home</title></head>');
    res.write('<body><h1> Hello from Node JS </h1> </body>');
    res.write('</html>');
    res.end();
}
module.exports = requestHandler;
```
### NOTE
You can only read the exported module.