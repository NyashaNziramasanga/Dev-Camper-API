//
// REVIEWS CONTROLLERS
//
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

const ReviewsCon = {
  /**
   * @desc    Get courses
   * @route   GET /api/v1/reviews
   * @route   GET /api/v1/bootcamps/:bootcampId/reviews
   * @access  Public
   * */
  async getReviews(req, res, next) {
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });

      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  }
};
module.exports = ReviewsCon;
