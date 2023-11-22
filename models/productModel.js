const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        Phones: "Phones",
        Computers: "Computers",
        SmartWatch: "SmartWatch",
        Camera: "Camera",
        Headphones: "Headphones",
        Gaming: "Gaming",
        Woman: "Woman's Fashion",
        Men: "Men's Fashion",
        Electronic: "Electronic",
        Home: "Home & Lifestyle",
        Medicine: "Medicine",
        Sport: "Sport & Outdoor",
      },
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      default: [],
    },
    idAuthor: {
      type: String,
      required: true,
    },
    offer: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    personRate: {
      type: [
        {
          idUser: String,
          rate: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
