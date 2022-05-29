const catchAsyncError = require('../middlewares/catchAsyncErrors')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntent.create({
        amount: req.body.amount,
        currency: 'usd',

        metadata: {integration_check: 'accept_a_payment'}
    })

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})
exports.sendStripApi = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        sendStripApi: process.env.STRIPE_API_KEY 
    })
})