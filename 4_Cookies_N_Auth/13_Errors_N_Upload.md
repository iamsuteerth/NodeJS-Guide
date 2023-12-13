- Errors are not necessarily bad for your app, you just need to handle errors correctly

# Types of errors

- Technical Errors
  - MongoDB server down : Show error page to user
- Expected Errors
  - File can't be read or DB op fails : Inform user and possibly retry
- Bugs/Logical Errors
  - User object used when it DNE : Handle these during development itself

## Working with errors

- Error is thrown
  - sync code : try {} catch {}
  - async code : then().catch()
  - You can either directly handle errors or use an express error handling function
- No error is thrown
  - Validate values
  - Either throw error or directly handle the error

Options after this?

- Error Page
- Intended Page/Response with error info.
- Redirect

### Error Handling through middleware

```js
const error = new Error(err);
error.httpStatusCode = 500;
next(err);
```

You will not reach the centralized error handling middleware if you throw errors around inside async code

Inside async code, DO THIS

```js
next(throw new Error(err));
```

Make sure to avoid `redirect` / `throw` infinite loops!

## Errors and HTTP status codes

Refer to <a href="https://github.com/iamsuteerth/NodeJS-Guide/blob/main/00_HTML_Status_Codes.md">All HTTP Status Codes</a> to learn more about ERROR Codes.

You can also check out <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status">Mozill Official Docs</a>

These are extra information which helps the browser understand if operation completed or not

- 2xx (Success)
- 3xx (Redirect)
- 4xx Client Side Error
- 5xx Server Side Error

Default status is 200

_Setting status codes doesn't mean that the server crashed or the response is incomplete_

We are using URLEncoded data which is basically text data so it would fail for "image" or file upload.

So we have to use

```js
npm i --save multer
```

This parses incoming requests for FILES.

You need to add this to the form as well which tells that the form submits data of varying type

```html
enctype="multipart/form-data"
```

Multer looks for exactly this type of data.

```js
app.use(multer({ dest: "images," }).single("image"));
```

```js
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // First argument is for errors
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + file.originalname);
  },
});
app.use(multer({ storage: fileStorage }).single("image"));
```

## Filter files by mime-type

```js
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
// in the middleware
```

### Serving images statically

```js
app.use("/images", express.static(path.join(__dirname, "images")));
```

Also, make sure to edit the `.ejs` files to adjust for `/ < product.imagrUrl >`

### Reading data after loading

```js
fs.readFile(invoicePath, (err, data) => {
  if (err) {
    next(err);
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="' + invoiceName + '"'
  );
  res.send(data);
});
```

You should be streaming your data instead of pre loading it as your limited server memory can quickly overflow causing issues.

### Streaming Data

```js
const file = fs.createReadStream(invoicePath);
res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
file.pipe(res); // Forward the data that is read within the stream to the response which is a writable stream
```

### PDFKit - Creating PDF on the fly

**_Create PDFs_**

`npm install --save pdfkit`

```js
const pdfDoc = new pdfkit();
res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
pdfDoc.pipe(fs.createWriteStream(invoicePath)); // Ensure that the pdf we generate is also stored to the server
pdfDoc.pipe(res);
pdfDoc.fontSize(26).text("Invoice", { underline: true });
pdfDoc.text("-----------------------------------");
let totalPrice = 0;
order.products.forEach((prod) => {
  totalPrice += +prod.quantity * +prod.product.price;
  pdfDoc
    .fontSize(14)
    .text(
      prod.product.title +
        " - " +
        prod.quantity +
        " x " +
        "$" +
        prod.product.price
    );
});
pdfDoc.text("-----------------------------------");
pdfDoc.fontSize(18).text("Total Price : " + totalPrice);
pdfDoc.end();
```

Also, you can delete the files created using this method

```js
// The deleting product route
const prodId = req.body.productId;
Product.findById(prodId)
  .then((product) => {
    if (!product) {
      return next(new Error("Product not found"));
    }
    fileHelper.deleteFile(product.imageUrl);
    return Product.deleteOne({ _id: prodId, userId: req.user._id });
  })
  .then((_) => {
    console.log("Destroyed");
    res.redirect("/admin/products");
  })
  .catch((err) => {
    console.log("Some fuckup");
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
```

The helper function

```js
const fs = require("fs");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

exports.deleteFile = deleteFile;
```
