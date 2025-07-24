const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInputBuyer = require("../../validation/register-buyer");
const validateRegisterInputVendor = require("../../validation/register-vendor");
const validateLoginInput = require("../../validation/login");
const validateEditVendor = require("../../validation/edit-vendor");
const validateEditBuyer = require("../../validation/edit-buyer");

// Load models
const Buyer = require("../../models/Buyer");
const Vendor = require("../../models/Vendor");
const User = require("../../models/User");

const { ObjectId } = require("mongodb");
// @route POST api/users/register
// @desc Register users
// @access Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      if (req.body.role == "vendor") {
        // Form validation
        const { errors, isValid } = validateRegisterInputVendor(req.body);
        // Check validation
        if (!isValid) {
          return res.status(400).json(errors);
        }
        const newVendor = new Vendor({
          managerName: req.body.managerName,
          shopName: req.body.shopName,
          email: req.body.email,
          contact: req.body.contact,
          openTime: req.body.openTime,
          closeTime: req.body.closeTime,
        });

        newVendor.save().catch((err) => console.log(err));
      } else if (req.body.role == "buyer") {
        // Form validation

        const { errors, isValid } = validateRegisterInputBuyer(req.body);

        if (!isValid) {
          // Check validation
          return res.status(400).json(errors);
        }
        const newBuyer = new Buyer({
          name: req.body.name,
          email: req.body.email,
          batch: req.body.batch,
          contact: req.body.contact,
          age: req.body.age,
          wallet: 0,
          favFoods: [],
        });

        newBuyer.save().catch((err) => console.log(err));
      }

      // if no errors make a new user
      const newUser = new User({
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login and return JWT token
// @access Public

router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(400).json({ email: "Email not found" });
    } // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // user matched

        // Create JWT Payload

        const payload = {
          id: user.email,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              role: user.role,
              id: user._id,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

router.post("/getUser", (req, res) => {
  User.findById(ObjectId(req.body.id)).then((user) => {
    if (!user) {
      return res.status(400).json({ user: "User not found" });
    } else {
      if (user.role == "vendor") {
        Vendor.findOne({ email: user.email }).then((vendor) => {
          const user = { details: vendor, role: "vendor" };
          return res.json(user);
        });
      } else if (user.role == "buyer") {
        Buyer.findOne({ email: user.email }).then((buyer) => {
          const user = { details: buyer, role: "buyer" };
          return res.json(user);
        });
      }
    }
  });
});

router.post("/edit", (req, res) => {
  if (req.body.role == "vendor") {
    console.log("here");

    Vendor.findOne({ email: req.body.email }).then((vendor) => {
      if (!vendor) {
        return res.status(400).json({ email: "Email not found" });
      }
      const { errors, isValid } = validateEditVendor(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      vendor.managerName = req.body.managerName;
      vendor.shopName = req.body.shopName;
      vendor.contact = req.body.contact;
      vendor.openTime = req.body.openTime;
      vendor.closeTime = req.body.closeTime;
      vendor
        .save()
        .then((vendor) => res.json(vendor))
        .catch((err) => res.status(400).json(err));
    });
  } else if (req.body.role == "buyer") {
    Buyer.findOne({ email: req.body.email }).then((buyer) => {
      if (!buyer) {
        return res.status(400).json({ email: "Email not found" });
      }
      const { errors, isValid } = validateEditBuyer(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      buyer.name = req.body.name;
      buyer.batch = req.body.batch;
      buyer.contact = req.body.contact;
      buyer.age = req.body.age;
      buyer
        .save()
        .then((buyer) => res.json(buyer))
        .catch((err) => res.status(400).json(err));
    });
  }
});

router.post("/addMoney", (req, res) => {
  Buyer.findOne({ email: req.body.email }).then((buyer) => {
    if (!buyer) return res.status(400).json({ email: "buyer not found" });
    buyer.wallet = buyer.wallet + parseInt(req.body.amount);
    buyer
      .save()
      .then((buyer) => res.json(buyer))
      .catch((err) => res.status(400).json(err));
  });
});

router.post("/toggleFav", (req, res) => {
  Buyer.findOne({ email: req.body.email }).then((buyer) => {
    if (!buyer) {
      return res.status(400).json({ buyer: "User doesn't exists" });
    } else {
      if (buyer.favFoods.includes(req.body.foodId)) {
        buyer.favFoods = buyer.favFoods.filter(function (item) {
          return item !== req.body.foodId;
        });
      } else {
        buyer.favFoods.push(req.body.foodId);
      }
      buyer
        .save()
        .then((buyer) => res.json(buyer.favFoods))
        .catch((err) => res.status(400).json(err));
    }
  });
});

module.exports = router;
