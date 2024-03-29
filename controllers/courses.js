//
// COURSES CONTROLLERS
//
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

const CoursesCon = {
  /** 
   * @desc    Get courses
   * @route   GET /api/v1/courses
   * @route   GET /api/v1/bootcamps/:bootcampId/courses
   * @access  Public 
   * @param   bootcampId
   * */
  async getCourses(req, res, next){
    if (req.params.bootcampId) {
      const courses = await Course.find({ bootcamp: req.params.bootcampId });

      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } else {
     console.log('res.advancedResults>>>',res.advancedResults)
    }
  },

  /** 
   * @desc    Get a single course
   * @route   GET /api/v1/courses/:id
   * @access  Public 
   * @param   id 
   * */
  async getCourse(req, res, next){
    const course = await Course.findById(req.params.id).populate('bootcamp', 'name description');

    if (!course) {
      return next(new ErrorResponse(`No course with the ifd of ${req.params.id}`), 404);
    }

    res.status(200).json({ success: true, data: course });
  },

  /** 
   * @desc    Add course
   * @route   POST /api/v1/bootcamps/:bootcampId/courses
   * @access  Private 
   * @param   bootcampId 
   * */
  async addCourse(req, res, next){
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(new ErrorResponse(`No course with the id of ${req.params.bootcampId}`), 404);
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a course to ${bootcamp._id}  bootcamp`,
          404
        )
      );
    }

    const course = await Course.create(req.body);

    res.status(200).json({ success: true, data: course });
  },

  /** 
   * @desc    Update course
   * @route   PUT /api/v1/courses/:id
   * @access  Private 
   * @param   id 
  */
  async updateCourse(req, res, next){
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    // Make sure user is bootcamp owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update a ${course._id} course`,
          404
        )
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: course });
  },

  /** 
   * @desc    Delete course
   * @route   DELETE /api/v1/courses/:id
   * @access  Private 
   * @param   id 
   * */
  async deleteCourse (req, res, next){
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    // Make sure user is bootcamp owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delet a ${course._id} course`,
          404
        )
      );
    }

    await course.remove();

    res.status(200).json({ success: true, data: {} });
  },
}

module.exports = CoursesCon;
