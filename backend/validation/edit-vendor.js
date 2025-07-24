const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEditVendor(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions

  data.managerName = !isEmpty(data.managerName) ? data.managerName : "";
  data.shopName = !isEmpty(data.shopName) ? data.shopName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.contact = !isEmpty(data.contact) ? data.contact : "";
  data.openTime = !isEmpty(data.openTime) ? data.openTime : "";
  data.closeTime = !isEmpty(data.closeTime) ? data.closeTime : "";

  // Name checks

  // Manager name check
  if (Validator.isEmpty(data.managerName)) {
    errors.managerName = "Manager Name field is required";
  }

  // Shop name check
  if (Validator.isEmpty(data.shopName)) {
    errors.shopName = "Shop Name field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Contact number check
  if (Validator.isEmpty(data.contact)) {
    errors.contact = "Contact field is required";
  } else if (!data.contact.match("[0-9]{10}")) {
    errors.contact = "Contact Number must contain 10 digits";
  }

  // Open and Close Time check
  if (Validator.isEmpty(data.openTime)) {
    errors.openTime = "Opening Time field is required";
  }

  if (Validator.isEmpty(data.closeTime)) {
    errors.closeTime = "Closing Time field is required";
  } else if (data.openTime > data.closeTime) {
    errors.closeTime = "Closing Time cannot be before Opening Time";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
