Now, so far we haven't worked with the data we received from the form. That is going to change now. 

We are creating an array (`Keep in mind that despite the array being declared as const, we can add elements to it, we can't re-assign a new array to that variable`)

### A different way of exporting
```js
// In the admin file
exports.routes = router;
exports.products = products;
// In app.js file
const adminData = require('./routes/admin');
app.use('/admin', adminData.routes);
```

Now we are keeping a products array and exporting it for usage in `shop.js`. We initially see `shop.js []` as output but if we enter `Book` in the form, we get `shop.js [ { title: 'Book' } ]` as output.

When we exported the array, do note that it was exported as reference type object. This can be ONE way of exporting data but DO NOTE that the data stored here is exclusive to the node server. So both different users will see the same data which is not the kind of behaviour you normally want.

# Templating Engines

There is some HTML file with structure and JS imports with some placeholders.

Then there is NodeJS content which is replaced with HTML content by the templating engine. 

The result is an on the fly dynamically generated HTML file.

Options
## EJS
Sort of uses HTML
```html
<p> <%= name %></p>
```
Uses normal HTML and plain JS in templates
## Pug(Jade)
Uses a different syntax, a minimal version of HTML
```pug
p #{name}
```
Uses minimal HTML and custom template language
## Handlebars
Sort of uses HTML
```html
<p> {{ name }} </p>
```
Uses normal HTML and a custom template language

### Installing pug
```npm
npm install --save ejs pug express-handlebars
```
## Using PUG
We can simply tell express that we have a templating engine that is express confirming, use it to render dynamic templates.

After initializing express(), we can use the set function to store values, but certain names can be used to configure the server. They can be accessed using `.get()`

The list of variables can be found on <a href = "https://expressjs.com/en/api.html#app.set"> List of vars </a>.

`views` allow us to tell express where to find these dynamic views.

```js
app.set('view engine', 'pug');
```
This auto registers because pug has out of the box support with express.

The default setting is `process.cwd() + '/views'`

```js
// Here is how to do it explictly
app.set('views', 'views');
```
After this, we have to add our templating file with extension `.pug` in the views section.

Here is the basic pug format of a basic html 5 document
```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Document
    body 
```
Notice how there are not html tags here. However, the pug templating engine will compile our code into normal html. If you're using `VSC IDE` and using appropriate extensions, you will have a lot of code snippets auto completed

Pug code is indentation sensitive like python so be careful

Siblings stay on same level and nested components get intended

### Sample PUG Code
```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title My Shop
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/product.css")
    body 
        //- Since we have a main header class designed
        header.main-header    
            nav.main-header__nav 
                ul.main-header__item-list 
                    li.main-header__item
                        a.active(href="/") Shop 
                    li.main-header__item 
                        a(href="/admin/add-product") Add Product 
                             
```

```js
res.render('shop');
// The render method allows us to pass in data that should be added into our view. 
// It can be done by passing in a key value object
res.render('shop', {prods: adminData.products, doctTitle: 'Shop'});
```

Now these can be used like this

products can be iterated as we passed it in using `prods`
```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title #{doctTitle}
        link(rel="stylesheet", href="/css/main.css")
        link(rel="stylesheet", href="/css/product.css")
    body 
        //- Since we have a main header class designed
        header.main-header    
            nav.main-header__nav 
                ul.main-header__item-list 
                    li.main-header__item
                        a.active(href="/") Shop 
                    li.main-header__item 
                        a(href="/admin/add-product") Add Product 
        main 
            if prods.length > 0
                .grid
                    article.card.product-item
                        header.card__header
                            h1.product__title Great Book
                        .card__image
                            img(src="https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png", alt="A Book")
                        .card__content
                            h2.product__price $19.99
                            p.product__description A very interesting book about so many even more interesting things!
                        .card__actions
                            button.btn Add to Cart
            else
                h1 No Products
```
NOTE: If you have multiple classes, you have to merge and cocatinate using dots

We can use `layouts` to avoid code repetition.

```pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Page Not Found
        link(rel="stylesheet", href="/css/main.css")
        block styles 
    body 
        header.main-header    
            nav.main-header__nav 
                ul.main-header__item-list 
                    li.main-header__item
                        a(href="/") Shop 
                    li.main-header__item 
                        a.active(href="/admin/add-product") Add Product 
        block content
```
The block keyword is used to use this above layout in other pug files.

# Handlebars
```js
const expressHbs = require('express-handlebars');
app.engine('handlebars', expressHbs());
```
Registers a new templating engine which is sort of NOT built in. Pug was built in kind of, express handlebar isn't

To set the view engine
```js
app.set('view engine', 'handlebars');
```
For the files, you can simply use the extension set in `app.engine()`

Handlebars use regular HTML with some CUSTOM syntax.

The way data is passed into templates doesn't change with the engine. Where the object is passed as key-value pairs where the keys are available in the template    

## NOTE
Correct way to use handlebars is given below
```js
const expressHbs = require('express-handlebars');

const app = express();

app.engine(
  'hbs',
  expressHbs.engine({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs' // Necessary otherwise layout file gives errors, just how handlebars worked
  })
);
app.set('view engine', 'hbs');
app.set('views', 'views');
```
There is an if helper which is added like this `{{#}}`, # are used for special block statements. Block statements are statements which are actually not outputting JUST some text but rather wrap content which should be ouputted conditionally or in a loop

Structure is like so
```js
{{#if hasProduct}}
    // Content
{{else}}
    // Content
{{/if}}
```
### IMPORTANT
You cannot use statements like prods.length > 0 and have to pass the result into the template
```js
res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
    // layout:false This is a special key understood by handlebars and it wont use the default layout (no need to explicitly set it to false)
  });
```
You cannot run logic in handlebar templates

Looping is done using the `#each prods` block statement. It is an implicit for each loop

You can access the in-iteration elements using the `this.` keyword

`LESS LOGIC IN TEMPLATE, MORE IN NDOE`

Unlike pug, where we had blocks, here we have to use `{{{ body }}}` 

This is understood by handlebars and we can target this specifically in views

If statements can be placed inline as well where they are false by default `{{#if activeShop }}active{{/if}}`

# EJS
```js
app.set('view engine', 'ejs');
```
EJS doesn't support layouts
```htmml
// Variables are embedded like this
<title><%= pageTitle %></title>
```
If else and loops
```js
<% if (prods.length > 0) { %>
<% for (let product of prods) { %>
<% } %>
<% } else { %>
<% } %>
```
Instead of layouts, EJS offers partials. The idea is to reuse some code blocks. These blocks can then be embedded into the ejs files

`<%=` will not render the string containing html code but rather as text which can be avoided by using the `<%-` instead

To include an element in the page

```js
<%- include('includes/head.ejs') %>
```
The function takes the path as parameter
