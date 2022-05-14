const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErros = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
exports.newProduct = catchAsyncErros(async (req, res, next) => {

  req.body.user = req.user.id
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getProducts = catchAsyncErros(async (req, res, next) => {

  const resPerPage = 4;
  const productCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;


    res.status(200).json({
      success: true,
      productCount,
      products,
    });


});

exports.getSingleProduct = catchAsyncErros(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErros(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErros(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product is deleted.",
  });
});


exports.createProductReview = catchAsyncErros( async (req, res, next) => {

  const {rating, comment, productId} = req.body
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }
  
  const product = await Product.findById(productId)

  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )

  if(isReviewed) {
    product.reviews.forEach(review => {
      if(review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    })

  }else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({validateBeforeSave: false})

  res.status(200).json({
    success: true
  })
})

exports.getProductsReviews = catchAsyncErros(async (req, res, next) => {
  const product = await Product.findById(req.query.id)

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

exports.deleteReview = catchAsyncErros(async (req, res, next) => {
  const product = await Product.findById(req.query.productId)

  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
  const numOfReviews = reviews.length
  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

  await Product.findByIdAndUpdate(req.query.id, {
    reviews,
    ratings,
    resPerPage,
    numOfReviews
  },{
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
})