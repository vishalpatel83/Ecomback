const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const category = require("../models/category");
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }
    // destrucring
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "please include all fields",
      });
    }
    let product = new Product(fields);
    //handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size to big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "saving tshirt in db failed",
        });
      }
      res.json(product);
    });
  });
};
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      res.status(400).json({
        error: "product will be not deleted",
      });
    }
    res.json({
      message: "product deleted suceessfully",
      deletedProduct,
    });
  });
};
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with image",
      });
    }
    //updation code
    let product = req.product;
    product = _.extend(product, fields);
    //handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size to big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "updation failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortby = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") //not selecrt the photo
    .populate("category")
    .sort([sortBy, "asc"])
    .limit(limit)
    .exec((err, product) => {
      if (err) {
        rs.status(400).json({
          error: "No Product Found",
        });
      }
      res.json(product);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  //distinct:-Creates a Query for a distinct operation.
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).status({
        error: "No Category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: {
          _id: prod._id,
        },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, product) => {
    if (err) {
      return res.status().json({
        error: "bulk operation failed",
      });
    }
    next();
  });
};
