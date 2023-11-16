# MVC - Model View Controller
## Separation of concerns
Making sure different parts of your code do different things and which port is responsible for what

Models are basically objects which are responsible for representing data in your code. Things like saving, fetching data to/from a file. These are handled by models.

Views are what the user sees. Decoupled from your code and are just having light integrations regarding data injected into our templating engine to generate these views.

Controllers are connection point betweem the other two. Its basically the middleman.

Routes basically define upon which path for which http method, which controller code should execute.

This is the general pattern in an app built with express which heavily relies on middleware concept. The controllers are also sort of split up across middleware functions or some of the logic might be moved into another middleware function.

Its a good idea to separate controllers from the routes as these files CAN get quite big.

`products.js` will have all the controller code related to, well PRODUCTS

### How to place the function (add product in this case)
```js
// controlllers/products.js
exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};
// routes/admin.js
const productController = require('../controlllers/products');
router.get('/add-product', productController.getAddProduct);
```

## Models
Models are a common way of defining your data type in any development project. Be it NodeJS, Flutter or ReactJS.

Here's how you can define one
```js
module.exports = class Product {
    constructor(t){
        this.title = t;
    }
    save(){
        products.push(this);
    }
    static fetchAll(){
        return this.products;
    }
}
```
```js
// Model code
const fs = require('fs');
const path = require('path');
// This is not fully correct
module.exports = class Product {
    constructor(t){
        this.title = t;
    }
    save(){
        // products.push(this);
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, (error, data) => {
            let products = [];
            if(!error){
                products = JSON.parse(data);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products, (error) => {console.log(error)}));
        });
    }

    static fetchAll(){
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, (error, data) => {
            if(error){
                return [];
            }
            return JSON.parse(data);
        });
    }
}
```
Keep in mind that this is asynchronous code.

The fetchAll method here executes line by line.

The function itself does not return anything.

These return statements here belong to this inner function here, not to this outer function, so nothhing is returned actually.

It returns undefined therefore and hence in the shop.ejs file, if we try to access the length on products, an error comes up that length is not defined

Now something complex is done to solve this.

- First, the fetchAll function is passed on a callbackFunction which is render in this case taking in products as argument
- In the actual function, we call the render callback with the products array state

```js
const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
```
Now, this looks SUPER complex but let's break down what's happening.

- The getProductsFromFile takes a callback function as argument and calls it passing the array products (depending on the error variable) as the callback function's self argument
- This argument is then used for the logic in the callbackFunction's code which in this case is rendering using the EJS templating engine.

## Summary
### Model
- Responsible for representing your data
- Responsible for managing your data
- Doesn't matter if you manage data anywhere
- Contains data related logic
### View
- What the user sees
- Shouldn't contain TOO much logic
### Controller
- Connects Model and View
- Should only make sure that the two can communicate in both directions

# Dynamic Routing

```js
// Can be setup like this
router.get("/products/:productId");
```

But its important to consider the order of this function call because `:productId` can be anything, even `delete`

A tricky concept here

```js
const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
        cb([]); // If error occurs, cb is called with [] as argument
        } else {
        cb(JSON.parse(fileContent));
        }
    });
};

static findById(id, cb){
    // We have an array of objects
    // The function here is the cb of getProductsFromFile which takes an argument called products
    // This argument can either be [] or the json.parse()
    getProductsFromFile(products => {
        // roducts refers to the array we get from getProductsFromFile function and we call THIS defined function WITH products as argument
        const product = products.find(p => p.id === id);
        // We are doing a similar thing, we compute product and CALL the cb function with product as argument
        cb(product);
    });
}

// In the shop.js controller
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        console.log(product);
    });
    res.redirect('/');
}
```
We can pass data in the request body which puts all the input data into the body.

When looping through all the products and then product is a local variable available in that loop. Then in include, included in the loop doesn't get that variable by default but you can pass it to that include. You can do so by adding a second argument to the include function where you again pass an object.


Now consider this model code
```js
module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch previous cart
    // Analyze => Find existing product
    // Add new prod/Increase quanity
    fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 };
        if (!err) {
            cart = JSON.parse(fileContent);
        }
        const existingProdcutIndex = cart.products.findIndex((prod) => prod.id === id);
        const existingProdcut = cart.products[existingProdcutIndex];
        let updatedProduct;
        if (existingProdcut) {
            updatedProduct = { ...existingProdcut };
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProdcutIndex] = updatedProduct;
        } else {
            updatedProduct = { id: id, qty: 1 };
            cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice = cart.totalPrice +  +productPrice;
        fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
        });
    });
  }
};
```
- We take product id and product price as function arguments
- Call the readFile async function passing the path p which we have defined in the top
- We create a default cart and if we dont get an error while reading the file, we parse the file content
- Finding the index of the product in the products array and assigning it to a variable
- If the product is already existing, update the produt with qty as previous + 1
- Update the products array with updated product
- If its a NEW product, then we create the object and add it to the array
- Update the total price
- Write the file

### Query Parameters
`/?edit=true&title=new`
This is called optional data
```js
const editMode = req.query.edit;
// Can be accessed like this
```
The extracted value is always a string, so "true" instead of true