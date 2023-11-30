# SQL vs NoSQL
## Goal : Store data and make it easily accessible
USE DATABASE

## SQL
Normal Table like format for storing data with schemas and relate tables using primary keys and secondary keys such as in RDBSs

There are database schemas or definitions about the database and all the data has to fit in it.

There are data relations for different relations having these kind of relationships
- One to One
- One to Many
- Many to Many
And the tables are connected with each other in one of these formats

### SQL QUERIES
```SQL
SELECT * FROM table_name WHERE condition;
```
## NoSQL
This doesn't follow the SQL definition of a database and uses different querying language.

You can still have a database. But here you have collections where there are documents.

These documents are similar to json

These documents are schemaless and there are no relations. Which means that there is duplicate data which is like having a document inside a document. Updating becomes difficult but retrieval is easier as we don't have to join multiple tables which make our queries complicated and difficult to understand

```SQL
SELECT
  e.employee_id AS "Employee #"
  , e.first_name || ' ' || e.last_name AS "Name"
  , e.email AS "Email"
  , e.phone_number AS "Phone"
  , TO_CHAR(e.hire_date, 'MM/DD/YYYY') AS "Hire Date"
  , TO_CHAR(e.salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS "Salary"
  , e.commission_pct AS "Comission %"
  , 'works as ' || j.job_title || ' in ' || d.department_name || ' department (manager: '
    || dm.first_name || ' ' || dm.last_name || ') and immediate supervisor: ' || m.first_name || ' ' || m.last_name AS "Current Job"
  , TO_CHAR(j.min_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') || ' - ' ||
      TO_CHAR(j.max_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS "Current Salary"
  , l.street_address || ', ' || l.postal_code || ', ' || l.city || ', ' || l.state_province || ', '
    || c.country_name || ' (' || r.region_name || ')' AS "Location"
  , jh.job_id AS "History Job ID"
  , 'worked from ' || TO_CHAR(jh.start_date, 'MM/DD/YYYY') || ' to ' || TO_CHAR(jh.end_date, 'MM/DD/YYYY') ||
    ' as ' || jj.job_title || ' in ' || dd.department_name || ' department' AS "History Job Title"
  
FROM employees e
-- to get title of current job_id
  JOIN jobs j 
    ON e.job_id = j.job_id
-- to get name of current manager_id
  LEFT JOIN employees m 
    ON e.manager_id = m.employee_id
-- to get name of current department_id
  LEFT JOIN departments d 
    ON d.department_id = e.department_id
-- to get name of manager of current department
-- (not equal to current manager and can be equal to the employee itself)
  LEFT JOIN employees dm 
    ON d.manager_id = dm.employee_id
-- to get name of location
  LEFT JOIN locations l
    ON d.location_id = l.location_id
  LEFT JOIN countries c
    ON l.country_id = c.country_id
  LEFT JOIN regions r
    ON c.region_id = r.region_id
-- to get job history of employee
  LEFT JOIN job_history jh
    ON e.employee_id = jh.employee_id
-- to get title of job history job_id
  LEFT JOIN jobs jj
    ON jj.job_id = jh.job_id
-- to get namee of department from job history
  LEFT JOIN departments dd
    ON dd.department_id = jh.department_id

ORDER BY e.employee_id;
```
SQL queries can be REALLY intimidating especially if they involve multiple joins which can REALLY make things difficult to debug and also understand.

### Characteristics
- No data schema
- No data relations
- No structure and no/few connetions
- Easier to scale
You CAN relate documents but you don't have to (and you shouldn't do it too much or else your queries can get slower)

## SQL vs NoSQL

| SQL                                                        | No SQL                                                   |
|------------------------------------------------------------|----------------------------------------------------------|
| Data uses schemas                                          | Schemaless                                               |
| Relations                                                  | No or very few relations                                 |
| Data is distributed across multiple tables                 | Data is typically merged or nested in  a few collections |
| Horizontal scaling is difficult but vertical is possible   | Both are possible                                        |
| Limitations for lots of reads and write queries per second | Great performance for mass read and write requests       |

## Hands ON
```
npm install --save mysql2
```
This is to add mysql2 as a production dependency 

There are 2 ways of connecting to a DB

One is to create ONE connection and close after executing a query but this code needs to be executed for ALL queries and is quite inefficient.

The best method is to use a ConnectionPool.

This allows us to create a pool of connections and reach out to it which gives us a new connection from the pool allowing us to execute multiple queries simultaneously. The pool can be finished when the app shuts down

How to create one?
```js
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: 'node-complete', // As there can be multiple DBs in the server
  password: 'password',
});
module.exports = pool.promise();
```
We are exporting it like this which will allow us to use promises and use ASYNC data avoiding nested functions and use promise chain instead!

```js

```

It is quite difficult to keep writing SQL commands directly in functions using `Sequalize`

# Sequalize
<div align="center">
<a href="http://docs.sequelizejs.com/" alt="docs">Official Docs for SEQUALIZE (Object Relational Mapping Library)</a>
</div>

#

We simply create a JS object and sequalize does rest
## Core Concepts
- Models       --> User, Produce etc.
- Instances    --> `const user = User.build()`
- Queries      --> `User.findAll()`
- Associations --> `User.hasMany(Products)`

How to instantiate
```js
const Sequalize = require("sequelize");
const sequelize = new Sequalize("node-compete", "root", "IAmSuteerth2021@", {
  dialect: "mysql",
  host: "localhost",
});
```
How to create a model (Refer to docs for details info <a href="https://sequelize.org/docs/v7/models/defining-models/" alt="docs">here</a>)
```js
const Sequalize = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequalize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequalize.STRING,
  price: {
    type: Sequalize.DOUBLE,
    allowNull: false,
  },
  imageUrl: { type: Sequalize.STRING, allowNull: false },
  description: { type: Sequalize.STRING, allowNull: false },
});

module.exports = Product;
```

How to run? `Do this in app.js`
```js
sequalize
  .sync()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
// Syncs your models with tables and listen to its result
```
### Creating objects
Create does it in ONE go. Otherwise you have to save manually using build

## Note
With Sequelize v5, findById() was replaced by findByPk() but the core functionality is the same!

### Get all proucts
```js
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
```
### Get single product using where
We get a single object unlike an array of objects (how it was before) where we had to access the FIRST element of the array for everything
```js
// Method 1 using Primary Key
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product, 
        pageTitle: product.title,
        path: "/products", // Since product is part of it
      });
    })
    .catch((err) => console.log(err));
};
// Method 2 using where
Product.findAll({ where: { id: prodId } }).then((products) => {
    res.render("shop/product-detail", {
      product: products[0],
      pageTitle: products[0].title,
      path: "/products",
    });
  });
```
### Updating product
#### Avoiding nested promises and using another .then() where the catch block will catch it all
```js
Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => "Updated Product")
    .catch((err) => console.log(err));
```
NOTE - Move the redirect to second .then() otherwise we will be redirected FIRST before the update happens which will cause ASYNCHRONIZATION as the functions are async

### Deleting Product
```js
// Where method
Product.destroy({ where: { id: prodId } });
// FindByPk method
Product.findByPk(prodId)
  .then((product) => {
    return product.destroy();
  })
  .then((result) => {
      console.log("Destroyed");
      res.redirect("/admin/products");
    })
  .err((err) => console.log(err));
```
## Associations
A user `has many` products

A product `belongs to many` cart

A user `has one` cart

A user `has many order`

A product `belongs to many` order

This can be reflected in sequalize as well

The details can be found in the docs too

```js
Product.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
```
Delete all products if a user is deleted 

### How to define associations
```js
Product.belongsTo(User, {constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);
```
`Since we have already created the tables, we can force the associations from this point using this line in the init state`
```js
sequalize
  .sync({force : true})
```
### Managing a dummy user
```js
// Creating a middleware user to associate the user sequalize object with req
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; // sequalize object is stored here
      next();
    })
    .catch((err) => console.log(err));
});
```

Because of our associations setup previously

```js
req.user
  .createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  }).then((result) => {
    console.log(`Product ${title} added! at ${Date.now()}`);
    res.redirect("/admin/products");
  })
  .catch((err) => {
    console.log(err);
});
```
Where to store associations? AKA intermediate table
```js
Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart, {through : CartItem});
```

### Adding prdocut to cart - 1
```js
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; 
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      // Product already exists
      if (product) {
      }
      return Product.findByPk(prodId)
        .then((product) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }, // For that in between table, set these values
          });
        })
        .catch((err) => console.log(err));
    })
    .then((_) => res.redirect("/cart"))
    .catch((err) => console.log(err));
};
```
in the ejs file, we need to change `p.productData.title` to p.title since our object is directly coming from the database.

p.qty => `p.cartItem.qty`

This cartItem here stores the entry related to the obj its called upon and the value we are looking for