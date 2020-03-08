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
  .post(protect, authorize('user', 'admin'), asyncHandler(con.addReview));

router
  .route('/:id')
  .get(asyncHandler(con.getReview))
  .put(protect, authorize('user', 'admin'), asyncHandler(con.updateReview));

module.exports = router;
