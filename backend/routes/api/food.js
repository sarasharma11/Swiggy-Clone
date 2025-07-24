const express = require("express");
const router = express.Router();

// Load input validation
const validateFoodItem = require("../../validation/foodItem");

// Load models
const Food = require("../../models/Food");
const Vendor = require("../../models/Vendor");
const Buyer = require("../../models/Buyer");

const { ObjectId } = require("mongodb");
const Order = require("../../models/Order");

router.post("/addFood", (req, res) => {
  Food.findOne({ name: req.body.name, vendorID: req.body.vendorID }).then(
    (food) => {
      if (food) {
        return res.status(400).json({ food: "Item already exists" });
      } else {
        const { errors, isValid } = validateFoodItem(req.body);
        // Check validation
        if (!isValid) {
          return res.status(400).json(errors);
        }
        const newFood = new Food({
          name: req.body.name,
          price: req.body.price,
          rating: req.body.rating,
          veg: req.body.veg,
          addOns: req.body.addOns,
          tags: req.body.tags,
          vendorID: req.body.vendorID,
        });

        newFood
          .save()
          .then((food) => res.json(food))
          .catch((err) => console.log(err));
      }
    }
  );
});

router.post("/editFood", (req, res) => {
  Food.findOne({ name: req.body.name, vendorID: req.body.vendorID }).then(
    (food) => {
      if (!food) {
        return res.status(400).json({ food: "Item doesn't exists" });
      } else {
        food.name = req.body.name;
        food.price = req.body.price;
        food.rating = req.body.rating;
        food.veg = req.body.veg;
        food.addOns = req.body.addOns;
        food.tags = req.body.tags;
        food
          .save()
          .then((food) => res.json(food))
          .catch((err) => res.status(400).json(err));
      }
    }
  );
});

router.post("/deleteFood", (req, res) => {
  Food.deleteOne({ _id: req.body._id }, function (err) {
    if (err) return console.log(err);
    return res.json({ success: true });
  });
});

router.post("/getFood", (req, res) => {
  Food.find({ vendorID: req.body.id }).then((food) => {
    if (!food) {
      return res.status(400).json({ food: "Item doesn't exists" });
    } else {
      return res.json(food);
    }
  });
});

router.post("/getSingleFood", (req, res) => {
  Food.findOne({ _id: req.body.foodId }).then(async (food) => {
    if (!food) {
      return res.status(400).json({ food: "Item doesn't exists" });
    } else {
      const user = await User.findOne({ _id: ObjectId(food.vendorID) });
      const vendor = await Vendor.findOne({ email: user.email });
      const tempFood = {
        _id: food._id,
        name: food.name,
        price: food.price,
        rating: food.rating,
        veg: food.veg,
        addOns: food.addOns,
        tags: food.tags,
        vendorName: vendor.managerName,
        vendorShopName: vendor.shopName,
        vendorOpenTime: vendor.openTime,
        vendorCloseTime: vendor.closeTime,
        vendorID: user._id,
      };
      return res.json(tempFood);
    }
  });
});

router.get("/displayFood", (req, res) => {
  Food.find().then(async (food) => {
    if (!food) {
      return res.status(400).json({ display: "No items to display" });
    }

    let tempFood = [];

    await Promise.all(
      food.map(async (foodItem, index) => {
        const user = await User.findOne({ _id: ObjectId(foodItem.vendorID) });
        const vendor = await Vendor.findOne({ email: user.email });
        tempFood.push({
          _id: foodItem._id,
          name: foodItem.name,
          price: foodItem.price,
          rating: foodItem.rating,
          veg: foodItem.veg,
          addOns: foodItem.addOns,
          tags: foodItem.tags,
          vendorName: vendor.managerName,
          vendorShopName: vendor.shopName,
          vendorOpenTime: vendor.openTime,
          vendorCloseTime: vendor.closeTime,
          vendorID: user._id,
        });
      })
    );

    return res.json(tempFood);
  });
});

router.post("/placeOrder", (req, res) => {
  Buyer.findOne({ email: req.body.email }).then((buyer) => {
    if (req.body.price <= buyer.wallet) {
      buyer.wallet = buyer.wallet - req.body.price;
      buyer.save().catch((err) => res.status(400).json(err));
    } else {
      return res.status(400).json({ wallet: "Insufficient balance" });
    }
    const newOrder = new Order({
      quantity: req.body.quantity,
      foodId: req.body.foodId,
      vendorID: req.body.vendorID,
      addOns: req.body.addOns,
      placedTime: Date.now(),
      status: 0,
      price: req.body.price,
      buyerID: req.body.buyerID,
    });
    newOrder
      .save()
      .then(() => res.json(buyer.wallet))
      .catch((err) => console.log(err));
  });
});

router.post("/changeStatus", (req, res) => {
  Order.findOne({ _id: ObjectId(req.body.id) }).then((order) => {
    if (!order) {
      return res.status(400).json({ display: "No orders to display" });
    } else {
      if (req.body.rejected) {
        order.status = 5;
        console.log(order.status);
        order
          .save()
          .then(() => res.json(order.status))
          .catch((err) => res.status(400).json(err));
      }
      if (req.body.pickup) {
        order.status = 4;
        order
          .save()
          .then(() => res.json(order.status))

          .catch((err) => res.status(400).json(err));
      }
      if (order.status < 4) {
        order.status = order.status + 1;
        order
          .save()
          .then(() => res.json(order.status))
          .catch((err) => res.status(400).json(err));
      }
    }
  });
});

router.post("/getOrders", (req, res) => {
  if (req.body.role == "buyer") {
    Order.find({ buyerId: req.body.id }).then(async (orders) => {
      if (!orders) {
        return res.status(400).json({ display: "No orders to display" });
      }

      let tempOrders = [];

      await Promise.all(
        orders.map(async (order, index) => {
          const food = await Food.findOne({ _id: ObjectId(order.foodId) });
          const user = await User.findOne({ _id: ObjectId(order.vendorID) });
          const vendor = await Vendor.findOne({ email: user.email });
          tempOrders.push({
            id: order._id,
            quantity: order.quantity,
            addOns: order.addOns,
            placedTime: order.placedTime,
            status: order.status,
            price: order.price,
            rating: food.rating,
            vendorName: vendor.managerName,
            foodItem: food.name,
          });
        })
      );
      return res.json(tempOrders);
    });
  } else if (req.body.role == "vendor") {
    Order.find({ vendorID: req.body.id }).then(async (orders) => {
      if (!orders) {
        return res.status(400).json({ display: "No orders to display" });
      }

      let tempOrders = [];

      await Promise.all(
        orders.map(async (order, index) => {
          const food = await Food.findOne({ _id: ObjectId(order.foodId) });
          tempOrders.push({
            id: order._id,
            quantity: order.quantity,
            addOns: order.addOns,
            placedTime: order.placedTime,
            status: order.status,
            foodItem: food.name,
          });
        })
      );
      return res.json(tempOrders);
    });
  }
});

router.post("/stats", (req, res) => {
  let ordersPlaced = 0;
  let pendingOrders = 0;
  let completedOrders = 0;
  var freq = {};
  Order.find({ vendorID: req.body.id }).then(async (orders) => {
    ordersPlaced = orders.length;
    orders.forEach((order) => {
      if (order.status < 4) pendingOrders++;
      if (order.status == 4) completedOrders++;

      if (order.foodId in freq) freq[order.foodId] += 1;
      else freq[order.foodId] = 1;
    });

    var sortable = [];
    for (var key in freq) {
      sortable.push([key, freq[key]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    sortable.slice(0, Math.min(4, sortable.length));

    let foodItems = [];
    await Promise.all(
      sortable.map(async (id, index) => {
        const food = await Food.findOne({ _id: ObjectId(id[0]) });
        foodItems.push(food.name);
      })
    );

    return res.json({
      foodItems: foodItems,
      ordersPlaced: ordersPlaced,
      pendingOrders: pendingOrders,
      completedOrders: completedOrders,
    });
  });
});

module.exports = router;
