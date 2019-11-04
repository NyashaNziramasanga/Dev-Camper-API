//API CONTROLLERS

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Show all Bootcamps' });
};

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps/:1
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Show Bootcamps ${req.params.id}` });
};

// @desc    Creat new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, message: 'Create new bootcamp' });
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, message: `Update Bootcamps ${req.params.id}` });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Delete Bootcamps ${req.params.id}` });
};
