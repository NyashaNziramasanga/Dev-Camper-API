const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResult');
const asyncHandler = require('../middleware/async');
const con = require('../controllers/reviews');
const Review = require('../models/Review');
const express = require('express');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'bootcamp', select: 'name description' }),
    asyncHandler(con.getReviews)
  )

module.exports = router;
