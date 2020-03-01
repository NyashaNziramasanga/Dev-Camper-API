const advancedResults = require('../middleware/advancedResult');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const con = require('../controllers/bootcamps');
const express = require('express');
const router = express.Router();

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses',asyncHandler(courseRouter));
router.use('/:bootcampId/reviews',asyncHandler(reviewRouter));

router.route('/radius/:zipcode/:distance').get(asyncHandler(con.getBootcampsInRadius));

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), asyncHandler(con.getBootcamps))
  .post(protect, asyncHandler(con.createBootcamp));

router
  .route('/:id')
  .get(asyncHandler(con.getBootcamp))
  .put(protect, authorize('publisher', 'admin'), asyncHandler(con.updateBootcamp))
  .delete(protect, authorize('publisher', 'admin'), asyncHandler(con.deleteBootcamp));

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), asyncHandler(con.bootcampPhotoUpload));

module.exports = router;
