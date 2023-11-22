const express = require("express");
const { mongoose } = require("mongoose");
const httpStatusText = require("./utils/httpStatusText");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const verify = require("./middlewares/verifyUser");
require("dotenv").config();
const app = express();
app.use(express.json());


app.use(cors());
app.use("/api/", authRoute);
app.use("/api/products", productRoute);
app.use(verify);
app.use("/api/user", userRoute);

app.all("*", (req, res, next) => {
  const error = appError.create(
    "This Resource is Not Available",
    404,
    httpStatusText.ERROR
  );
  return next(error);
});
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});
app.listen(process.env.PORT, () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
});
