const Product = require("../models/product");
// const mongodb = require("mongodb");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(
  //   title,
  //   price,
  //   description,
  //   imageUrl,
  //   null,
  //   req.user._id
  // );
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId:req.user // You can just save the entire object, convenience by mongoose
  });
  product
    .save() //This is provided by mongoose
    .then((result) => {
      console.log(`Product ${title} added! at ${Date.now()}`);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  // Product.findProductById(prodId)
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: true,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = +req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  // const updatedProduct = new Product(
  //   updatedTitle,
  //   updatedPrice,
  //   updatedDesc,
  //   updatedImageUrl,
  //   prodId
  // );
  Product.findById(prodId)
    .then((product) => {
      // We get an entire mongoose object with functions here
      product.title = updatedTitle;
      product.description = updatedDesc;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    // updatedProduct
    // .save()
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll() mongoose doesn't give a cursor
  // You can set it to return cursor as well, which is recommended for LARGE data
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.deleteById(prodId)
  Product.findByIdAndDelete(prodId)
    .then((_) => {
      console.log("Destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
