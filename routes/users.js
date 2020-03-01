const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResult');
const asyncHandler = require('../middleware/async');
const con = require('../controllers/users');
const User = require('../models/User');
const express = require('express');

const router = express.Router({ mergeParams: true });

// Any route below will be protected and only admin have access
router.use(protect);
router.use(authorize('admin'));

router
	.route('/')
	.get(advancedResults(User), asyncHandler(con.getUsers))
	.post(asyncHandler(con.createUser));

router
	.route('/:id')
	.get(asyncHandler(con.getUser))
	.put(asyncHandler(con.updateUser))
	.delete(asyncHandler(con.deleteUser));

module.exports = router;
