const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendemail');
const User = require('../models/User');
const SendTokenResponse = require('../middleware/sendTokenResponse');
 
/**
 * @desc    Auth Controller Methods
 * */ 
const Auth = {
  /** 
   * @desc    Register user
   * @route   POST /api/v1/auth/register
   * @access  Public 
   * @param   name
   * @param   email
   * @param   password
   * @param   role 
   * */
  async register(req, res, next){
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    await SendTokenResponse(user, 200, res);
  },

  /** 
   * @desc    Login user
   * @route   POST /api/v1/auth/login
   * @access  Public 
   * @param   email 
   * @param   password 
   * */
  async login(req, res, next){
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    await SendTokenResponse(user, 200, res);
  },

  /** 
   * @desc    Get current logged in user
   * @route   POST /api/v1/auth/me
   * @access  Private 
   * */
  async getMe(req, res, next){
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  },

  /** 
   * @desc    Update user details
   * @route   PUT /api/v1/auth/updatedetails
   * @access  Private 
   * @param   name 
   * @param   email 
   * */
  async updateDetails(req, res, next){
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  },

  /** 
   * @desc    Update password
   * @route   PUT /api/v1/auth/updatepassword
   * @access  Private 
   * @param   currentPassword 
   * @param   newPassword 
   * */
  async updatePassword(req, res, next){
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!await user.matchPassword(req.body.currentPassword)) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    await SendTokenResponse(user, 200, res);
  },

  /** 
   * @desc    Forgot password
   * @route   POST /api/v1/auth/forgotpassword
   * @access  Public 
   * @param   email 
   * */
  async forgotPassword(req, res, next){
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpired = undefined;

      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse('Error could not be sent', 500));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  },

  /** 
   * @desc    Reset password
   * @route   PUT /api/v1/auth/resetpassword/:resettoken
   * @access  Public 
   * @param   resettoken
   * @param   password
   * */
  async resetPassword(req, res, next){
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordExpired = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    await SendTokenResponse(user, 200, res);
  },
}

module.exports = Auth;