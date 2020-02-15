const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/async');
const con = require('../controllers/auth');
const express = require('express');
const router = express.Router();

router.post('/register', asyncHandler(con.register));
router.post('/login', asyncHandler(con.login));
router.get('/me', protect, asyncHandler(con.getMe));

router.put('/updatedetails', protect, asyncHandler(con.updateDetails));
router.put('/updatepassword', protect, asyncHandler(con.updatePassword));

router.post('/forgotpassword', asyncHandler(con.forgotPassword));
router.put('/resetpassword/:resettoken', asyncHandler(con.resetPassword));

module.exports = router;
