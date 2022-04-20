const express = require('express')
const router = express.Router()

const { getProducts } = require('../controllers/productContollers')

router.route('/products').get(getProducts)

module.exports = router