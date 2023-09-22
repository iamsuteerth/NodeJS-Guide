# What is NPM?
NPM means Node Package Manager and it can be initiated with
```js
npm init
```
It will ask you for package names and the part in the parenthesis is the default package name.

This process gives you a package.json file with your given settings. The keys and values are put between double quotes.

With this config file, a package.json is created where you can have a `start` script under that section. `start` is a special keyword which where it will look for a script under start.
### NOTE
For normal scripts, you have to:
```js
npm run <script-name>
// Otherwise for special scripts such as start
npm start
```
## NPM and Packages
You can have 3rd party packages or dependencies in your project such as express, body-parser etc. which provide additional functionality over the core node packages and you don't need to reinvent the wheel all the time from the npm repository.

### How to install?
```js
npm install nodemon
```
nodemon would be used only during development and you can configure how packages are to be installed.

Packages can be production dependencies too which help run on servers.

This is done like this

```js
npm install nodemon --save
// Production dependency
npm install nodemon --save-dev
// Development dependency
npm install -g nodemon
// Global usage
```
`"nodemon": "^3.0.1"` tells how the package will be updated if you run npm install. Here it will update it to the latest version.

You can delete the node_modules folder if you want to. Re running `npm install` will re-create it. The folder created here is quite big because all the peer dependencies are also installed which can start a domino effect.

## Working with nodemon
If you try to run `nodemon app.js` from the terminal, you won't be able to run it as it looks for the package globally and not locally.

For that, you need to modify the scripts section in package.json like this

```js
"scripts":{
    "start" : "nodemon app.js",
},
```
This will work as we run it locally through this method. Now the server auto-restarts if we save changes.

# Error Types
### Syntax Errors
This is if you have a typo in your code or you forget something like a closing curly brace. You will have an error which should automatically be thrown when you try to run your project.

Most of the time, these are pretty easy to fix

### Runtime Errors
Thesehese are errors which are not typos but where you try to execute some code which will just break when it runs.

A good example is when you go out of bound with the array index in a C++ for loop.

### Logical Errors
You will never see an error message for these kind of errors, thus making these quite difficult to debug.

## Finding and fixing syntax errors
They are quite easy to fix as you get a crash instantly when you try to run the code and you get the line number in the error message.

You can get help for these using a good IDE such as VisualStudioCode (In my opinion, using anything else is just not worth it).

## Dealing with Runtime Errros
These are highlighted during `runtime` as you could have guessed.

`Cannot set headers after they are sent to the client` is one such error.

Let's say you end a request with res.end() and then you are again trying to write after a setHeader() funciton, that's when you will get this error.

## Logical Errors
These don't cause error messages and hence they are difficult to detect because they simple result in your code not working the way it was intended to work.

This can be fixed using the NodeJS debugger which is bundled with VSC

You have to set breakpoints and run the app in debug mode and at the breakpoint, the code execution stops and you can check what's in the variables at that time and things like that allowing you to look inside your code while it's running.

You can set variables in `watch` section of the debug mode.

You can also run operations in the debug console without affecting the code.

In order to restart the debugger after edits, you have to edit the launch.json
```js
// Sample .vscode/launch.json
// Here nodemon needs to be installed globally which is necessary for this
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\alpha\\app.js",
            "restart": true,
            "runtimeExecutable": "nodemon",
            "console": "integratedTerminal"
        }
    ]
}
```
## Important
You can change variable values during debugging at breakpoints which will affect the active runtime.
