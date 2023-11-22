const asyncWrapper = require("../middlewares/asyncWrapper");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const appError = require("../utils/appError");
const { FAIL, SUCCESS } = require("../utils/httpStatusText");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
const getUserCart = asyncWrapper(async (req, res, next) => {
  const idUser = req.user.id;
  const user = await userModel.findOne({ _id: idUser });
  if (!user) {
    const error = appError.create("User Not Found", 400, FAIL);
    return next(error);
  }
  return res.json({
    cart: user.cart,
  });
});
const addUserCart = asyncWrapper(async (req, res, next) => {
  const idUser = req.user.id;
  const { productId } = req.body;
  const user = await userModel.findOne({ _id: idUser });
  if (!user) {
    const error = appError.create("User Not Found", 400, FAIL);
    return next(error);
  }
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    const error = appError.create("Product Not Found", 400, FAIL);
    return next(error);
  }
  if (user.cart.includes(productId)) {
    const newCart = user.cart.filter((e) => e !== productId);
    await user.updateOne({
      $set: {
        cart: newCart,
      },
    });
    return res.status(200).json({
      data: {
        message: "Product Remove from Cart",
      },
      status: SUCCESS,
    });
  } else {
    user.cart.push(productId);
    await user.updateOne({
      $set: {
        cart: user.cart,
      },
    });
    return res.status(201).json({
      data: {
        message: "Product Add To Cart",
      },
      status: SUCCESS,
    });
  }
});
const deleteUserCart = asyncWrapper(async (req, res, next) => {
  const productId = req.body.productId;
  if (!productId) {
    const error = appError.create("Id Product Is Missing!", 400, FAIL);
    return next(error);
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = appError.create("Id Product Is Not Valid!", 400, FAIL);
    return next(error);
  }
  const user = await userModel.findOne({ _id: req.user.id });
  if(!user.cart.includes(productId)){
    const error = appError.create("Product Is Not Valid In User Cart!", 400, FAIL);
    return next(error);
  }
  const newUserCart = user.cart.filter((val) => val != productId);
  await user.updateOne({ cart: newUserCart });
  return res.status(200).json({
    data: {
      message:"Product Is Removing From User Cart",
    },
    status: SUCCESS,
  });
});
const getUserWishlist = asyncWrapper(async (req, res, next) => {
  const idUser = req.user.id;
  const user = await userModel.findOne({ _id: idUser });
  if (!user) {
    const error = appError.create("User Not Found", 400, FAIL);
    return next(error);
  }
  return res.json({
    wishlist: user.wishlist,
  });
});
const addUserWishlist = asyncWrapper(async (req, res, next) => {
  const idUser = req.user.id;
  const { productId } = req.body;
  const user = await userModel.findOne({ _id: idUser });
  if (!user) {
    const error = appError.create("User Not Found", 400, FAIL);
    return next(error);
  }
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    const error = appError.create("Product Not Found", 400, FAIL);
    return next(error);
  }
  if (user.wishlist.includes(productId)) {
    const newWishlist = user.wishlist.filter((e) => e !== productId);
    await user.updateOne({
      $set: {
        wishlist: newWishlist,
      },
    });
    return res.status(200).json({
      data: {
        message: "Product Remove from Wishlist",
      },
      status: SUCCESS,
    });
  } else {
    user.wishlist.push(productId);
    await user.updateOne({
      $set: {
        wishlist: user.wishlist,
      },
    });
    return res.status(201).json({
      data: {
        message: "Product Add To Wishlist",
      },
      status: SUCCESS,
    });
  }
});
const deleteUserWishlist = asyncWrapper(async (req, res, next) => {
  const productId = req.body.productId;
  if (!productId) {
    const error = appError.create("Id Product Is Missing!", 400, FAIL);
    return next(error);
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = appError.create("Id Product Is Not Valid!", 400, FAIL);
    return next(error);
  }
  const user = await userModel.findOne({ _id: req.user.id });
  if(!user.wishlist.includes(productId)){
    const error = appError.create("Product Is Not Valid In User Wishlist!", 400, FAIL);
    return next(error);
  }
  const newUserCart = user.wishlist.filter((val) => val != productId);
  await user.updateOne({ wishlist: newUserCart });
  return res.status(200).json({
    data: {
      message:"Product Is Removing From User Wishlist",
    },
    status: SUCCESS,
  });
});
const deleteProduct = asyncWrapper(async (req, res, next) => {
  const idProduct = req.params.idProduct;
  if (!idProduct) {
    const error = appError.create("Id Product Is Missing!", 400, FAIL);
    return next(error);
  }
  const product = await productModel.findOneAndDelete({ _id: idProduct });
  if (!product) {
    const error = appError.create("Product Is Not Found!", 400, FAIL);
    return next(error);
  }
  if (product.idAuthor !== req.user.id) {
    const error = appError.create("Auth Error!", 400, FAIL);
    return next(error);
  }
  fs.rmSync(
    path.join(__dirname, "../uploads", product.idAuthor, product.title),
    {
      recursive: true,
      force: true,
    }
  );
  return res.status(200).json({
    data: null,
    status: SUCCESS,
  });
});
const addProduct = asyncWrapper(async (req, res, next) => {
  const images = req.files["photos"];

  const infoProduct = req.body;
  if (!infoProduct.title) {
    const error = appError.create("Title Product Is Required", 400, FAIL);
    return next(error);
  }
  if (infoProduct.title.length < 3) {
    const error = appError.create(
      "Title Should be more than or Equal 3",
      400,
      FAIL
    );
    return next(error);
  }
  if (!infoProduct.price) {
    const error = appError.create("Price Is Required", 400, FAIL);
    return next(error);
  }
  if (infoProduct.price < 1) {
    const error = appError.create("Price Should Be More Than 0", 400, FAIL);
    return next(error);
  }
  if (!infoProduct.category) {
    const error = appError.create("Category Is Required", 400, FAIL);
    return next(error);
  }
  if (!infoProduct.description) {
    const error = appError.create("Description Is Required", 400, FAIL);
    return next(error);
  }
  if (
    infoProduct.description.length < 10 ||
    infoProduct.description.length > 50
  ) {
    const error = appError.create(
      "Description Should Be between 10 And 50",
      400,
      FAIL
    );
    return next(error);
  }
  const imagesPath = [];
  fs.mkdirSync(
    path.join(__dirname, `../uploads`, req.user.id, infoProduct.title),
    {
      recursive: true,
    }
  );
  images.forEach((image) => {
    const imagePath = path.join(
      __dirname,
      `../uploads`,
      req.user.id,
      infoProduct.title,
      image.name
    );
    fs.writeFileSync(imagePath, image.data);
    imagesPath.push(imagePath);
  });
  const newProduct = await productModel.create({
    title: infoProduct.title,
    price: infoProduct.price,
    category: infoProduct.category,
    description: infoProduct.description,
    idAuthor: req.user.id,
    offer: infoProduct.offer,
    image: imagesPath,
  });
  return res.status(200).json({
    data: {
      product: newProduct,
    },
    status: SUCCESS,
  });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const images = req.files["photos"];

  const infoProduct = req.body;
  const productIsFound = await productModel.findOne({
    _id: req.params.idProduct,
  });
  if (!productIsFound) {
    const error = appError.create("Product Is Not Found", 400, FAIL);
    return next(error);
  }
  if (!infoProduct.title) {
    const error = appError.create("Title Product Is Required", 400, FAIL);
    return next(error);
  }
  if (infoProduct.title.length < 3) {
    const error = appError.create(
      "Title Should be more than or Equal 3",
      400,
      FAIL
    );
    return next(error);
  }
  if (!infoProduct.price) {
    const error = appError.create("Price Is Required", 400, FAIL);
    return next(error);
  }
  if (infoProduct.price < 1) {
    const error = appError.create("Price Should Be More Than 0", 400, FAIL);
    return next(error);
  }
  if (!infoProduct.category) {
    const error = appError.create("Category Is Required", 400, FAIL);
    return next(error);
  }
  if (!infoProduct.description) {
    const error = appError.create("Description Is Required", 400, FAIL);
    return next(error);
  }
  if (
    infoProduct.description.length < 10 ||
    infoProduct.description.length > 50
  ) {
    const error = appError.create(
      "Description Should Be between 10 And 50",
      400,
      FAIL
    );
    return next(error);
  }
  if (images.length) {
    fs.rmSync(
      path.join(
        __dirname,
        "../uploads",
        productIsFound.idAuthor,
        productIsFound.title
      ),
      {
        recursive: true,
        force: true,
      }
    );
    fs.mkdirSync(
      path.join(__dirname, `../uploads`, req.user.id, infoProduct.title),
      {
        recursive: true,
      }
    );
    const imagesPath = [];
    images.forEach((image) => {
      const imagePath = path.join(
        __dirname,
        `../uploads`,
        req.user.id,
        infoProduct.title,
        image.name
      );
      fs.writeFileSync(imagePath, image.data);
      imagesPath.push(imagePath);
    });
  }
  const newProduct = imagesPath
    ? await productModel.findOneAndUpdate(
        {
          _id: req.params.idProduct,
        },
        {
          title: infoProduct.title,
          price: infoProduct.price,
          category: infoProduct.category,
          description: infoProduct.description,
          idAuthor: req.user.id,
          offer: infoProduct.offer,
          image: imagesPath,
        }
      )
    : await productModel.findOneAndUpdate(
        {
          _id: req.params.idProduct,
        },
        {
          title: infoProduct.title,
          price: infoProduct.price,
          category: infoProduct.category,
          description: infoProduct.description,
          idAuthor: req.user.id,
          offer: infoProduct.offer,
        }
      );
  return res.status(200).json({
    data: {
      product: newProduct,
    },
    status: SUCCESS,
  });
});
module.exports = {
  getUserCart,
  addUserCart,
  deleteUserCart,
  getUserWishlist,
  addUserWishlist,
  deleteUserWishlist,
  addProduct,
  deleteProduct,
  updateProduct,
};
