const { Order, ProductCart } = require("../models/order");
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        erro: "failed to saved your oreder in db",
      });
    }
    res.json(order);
  });
};
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order found in db",
        });
      }
      req.order = order;
      next();
    });
};

exports.getAllOrdres = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No oredr found in db",
        });
      }
      res.json(order);
    });
};
exports.getOrderStatus = (req, res) => {
  res.json(Order.Schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot Update order status",
        });
      }
      res.json(order);
    }
  );
};
