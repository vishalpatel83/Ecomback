const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      res.status(400).json({
        error: "Catogory not found in Db",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "category not created",
      });
    }
    return res.json(cate);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, allcate) => {
    if (err) {
      res.status(400).json({
        error: "no category found",
      });
    }
    res.json(allcate);
  });
};

exports.updateCtaegory = (req, res) => {
  const category = req.category;
  console.log(category);

  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      res.status(400).json({
        error: "failed to update category",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      res.status(400).json({
        error: "failed to remove category",
      });
    }
    res.json({
      message: "successfull deleted",
    });
  });
};
