const User = require('../models/User');

const UsersCon = {
	/**
	 * @desc    Get all users
	 * @route   GET /api/v1/auth/users
	 * @access  Private/Admin
	 * */
	async getUsers(req, res, next) {
		await res.status(200).json(res.advancedResults);
	},
	/**
	 * @desc    Get single user
	 * @route   GET /api/v1/auth/user/:id
	 * @access  Private/Admin
	 * */
	async getUser(req, res, next) {
		const user = await User.findById(req.params.id);
		res.status(200).json({ success: true, data: user });
	},
	/**
	 * @desc    Create a user
	 * @route   POST /api/v1/auth/user
	 * @access  Private/Admin
	 * */
	async createUser(req, res, next) {
		const user = await User.create(req.body);
		res.status(201).json({ success: true, data: user });
	},
	/**
	 * @desc    Update a user
	 * @route   PUT /api/v1/auth/user
	 * @access  Private/Admin
	 * */
	async updateUser(req, res, next) {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		res.status(200).json({ success: true, data: user });
	},
	/**
	 * @desc    Delete a user
	 * @route   DELETE /api/v1/auth/user
	 * @access  Private/Admin
	 * */
	async deleteUser(req, res, next) {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json({ success: true, data: {} });
	}
};
module.exports = UsersCon;
