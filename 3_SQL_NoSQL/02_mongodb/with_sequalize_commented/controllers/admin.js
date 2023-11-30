const Product = require("../models/product");
const mongodb = require("mongodb");

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
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  // req.user
  //   .createProduct({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description,
  //   })
  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   userId:req.user.id,
  // })
  product
    .save()
    .then((result) => {
      console.log(`Product ${title} added! at ${Date.now()}`);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then(res.redirect("/")).catch(error => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findProductById(prodId)
    // Product.findById(prodId, (product) => {
    //   if (!product) {
    //     res.redirect("/");
    //   }
    //   res.render("admin/edit-product", {
    //     pageTitle: "Add Product",
    //     path: "/admin/edit-product",
    //     editing: true,
    //     product: product,
    //   });
    // });
    // req.user
    // .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((product) => {
      // const product = products[0];
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
  const updatedProduct = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    prodId
  );
  // updatedProduct.save();
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     product.title = updatedTitle;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;
  //     product.imageUrl = updatedImageUrl;
  //     return product.save();
  //   })
  updatedProduct
    .save()
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("admin/products", {
  //     prods: products,
  //     pageTitle: "Admin Products",
  //     path: "/admin/products",
  //   });
  // });
  // req.user
  //   .getProducts()
  // Product.findAll()
  Product.fetchAll()
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
  // Product.deleteById(prodId);
  // Product.destroy({ where: { id: prodId } });
  // Product.findByPk(prodId)
  Product.deleteById(prodId)
    // .then((product) => {
    //   return product.destroy();
    // })
    .then((_) => {
      console.log("Destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
