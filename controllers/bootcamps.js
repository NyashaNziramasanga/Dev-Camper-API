//
// BOOTCAMPS CONTROLLER
//
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Path = require('path');

const BootcampsCon = {
  /** 
   * @desc    Get all Bootcamps
   * @route   GET /api/v1/bootcamps
   * @access  Public 
   * */
  async getBootcamps(req, res, next){
    res.status(200).json(res.advancedResults);
  },

  /**
   * @desc    Get all Bootcamps
   * @route   GET /api/v1/bootcamps/:1
   * @access  Public 
   * @param   id 
   * */
  async getBootcamp(req, res, next) {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamps not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
  },

  /**
   * @desc    Creat new bootcamp
   * @route   POST /api/v1/bootcamps
   * @access  Private 
   * @param   id 
   * */
  async createBootcamp (req, res, next){
    // Add logged in user to req.body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400)
      );
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  },

  /** 
   * @desc    Update bootcamp
   * @route   PUT /api/v1/bootcamps/:id
   * @access  Private 
   * @param   id
   * @param   role
   * */
  async updateBootcamp(req, res, next){
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamps not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 404)
      );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: bootcamp });
  },

  /**
   * @desc    Delete bootcamp
   * @route   DELETE /api/v1/bootcamps/:id
   * @access  Private 
   * @param   id 
   * @parma   role 
   * */
  async deleteBootcamp(req, res, next){
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamps not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 404)
      );
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
  },

  /**
   * @desc    Get Bootcamps within a radius
   * @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
   * @access  Private 
   * @param   zipcode
   * @param   distance
  */
  async getBootcampsInRadius(req, res, next){
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi/ 6,378km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } },
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  },

  /**
   * @desc    Upload Photo for bootcamp
   * @route   PUT /api/v1/bootcamps/:id/photo
   * @access  Private 
   * @param   id 
   * @param   role 
   * @param   files 
   * */
  async bootcampPhotoUpload(req, res, next){
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamps not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 404)
      );
    }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload a image (jpg,jpeg,png)`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(`Please upload an image of max size ${process.env.MAX_FILE_UPLOAD} `, 400)
      );
    }

    // Create Custom file name
    file.name = `photo_${bootcamp._id}${Path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        new ErrorResponse('Problem with file upload', 500);
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  },
}

module.exports = BootcampsCon; 