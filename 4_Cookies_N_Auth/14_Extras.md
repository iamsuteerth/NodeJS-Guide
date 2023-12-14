# Pagination

In a scenario where a LOT of items are there to display such as products on a page where you wouldn't want to display ALL of them. This is where pagination comes into play

**Implementation**

```js
const page = req.query.page;

Product.find()
  .skip(page - 1 * ITEMS_PER_PAGE)
  .limit(ITEMS_PER_PAGE)
  .then();
```

When using MongoDB, you can use skip() and limit() as shown in the last lecture.

But how would that work in SQL?

Here's how you would implement pagination in SQL code: https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging

To quickly sum it up: The LIMIT command allows you to restrict the amount of data points you fetch, it's your limit() equivalent. Combined with the OFFSET command (which replaces skip()), you can control how many items you want to fetch and how many you want to skip.

When using Sequelize, the official docs describe how to add pagination: https://sequelize.org/master/manual/model-querying-basics.html

### Modified code to accomodate pagination

```js
exports.getIndex = (req, res, next) => {
  const page = req.query.page;
  let totalProducts;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip(page - 1 * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        lastPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
```
## What are async requests
JSON data exchange basically without reloading or interrupting user flow

## Payments
- Collect payment method
- Verify payment method
- Charge payment method
- Manage payment method

It is quite complicated so its often done via 3rd party packages

Refer to the project and these files in particular for the implementation

`npm install --save stripe`

1. checkout.ejs
2. routes/shop.js
3. controllers/shop.js

#### You shouldn't rely on the success url for placing orders but instead use webhooks.