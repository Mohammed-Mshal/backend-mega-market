const asyncWrapper = require("../middlewares/asyncWrapper");
const productModel = require("../models/productModel");
const appError = require("../utils/appError");
const { FAIL, SUCCESS } = require("../utils/httpStatusText");

const getAllProduct = asyncWrapper(async (req, res, next) => {
  const products = await productModel.find({});
  return res.status(200).json({
    data: {
      products,
    },
    status: SUCCESS,
  });
});
const getProduct = asyncWrapper(async (req, res, next) => {
  const idProduct = await req.params.idProduct;
  const product = await productModel.findOne({ _id: idProduct });
  if (!product) {
    const error = appError.create("Product is Not Found", 400, FAIL);
    return next(error);
  }
  return res.status(200).json({
    data: {
      product,
    },
    status: SUCCESS,
  });
});
const getCategoryProduct = asyncWrapper(async (req, res, next) => {
  const category = req.params.category;
  const products = await productModel.find({ category });
  return res.status(200).json({
    data: {
      product,
    },
    status: SUCCESS,
  });
});
module.exports = { getAllProduct, getProduct,getCategoryProduct };
