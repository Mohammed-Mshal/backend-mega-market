const express = require("express");
const { getProduct,getAllProduct, getCategoryProduct } = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getAllProduct);
router.route("/:category").get(getCategoryProduct);
router.route("/:idProduct").get(getProduct);

module.exports = router;
