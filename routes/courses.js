const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResult');
const asyncHandler = require('../middleware/async');
const con = require('../controllers/courses');
const Course = require('../models/Course');
const express = require('express');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }),asyncHandler(con.getCourses)) 
  .post(protect, authorize('publisher', 'admin'), asyncHandler(con.addCourse));

router
  .route('/:id')
  .get(asyncHandler(con.getCourse))
  .put(protect, authorize('publisher', 'admin'), asyncHandler(con.updateCourse))
  .delete(protect, authorize('publisher', 'admin'), asyncHandler(con.deleteCourse));

module.exports = router;
