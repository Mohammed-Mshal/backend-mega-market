const express = require("express");
const {
  getUserCart,
  addUserCart,
  deleteUserCart,
  getUserWishlist,
  addUserWishlist,
  deleteUserWishlist,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/userController");
const fileUpload = require("express-fileupload");
const filePayloadExist = require("../middlewares/filePayloadExist");
const fileExtLimiter = require("../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");
const router = express.Router();

router.route("/cart").get(getUserCart).post(addUserCart).delete(deleteUserCart);
router
  .route("/wishlist")
  .get(getUserWishlist)
  .post(addUserWishlist)
  .delete(deleteUserWishlist);
router
  .route("/product")
  .post(
    fileUpload({ createParentPath: true }),
    filePayloadExist,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    addProduct
  );
router
  .route("/product/:idProduct")
  .delete(deleteProduct)
  .patch(
    fileUpload({ createParentPath: true }),
    filePayloadExist,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter,
    updateProduct
  );
module.exports = router;
