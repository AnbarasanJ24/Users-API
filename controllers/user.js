const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const ErrorResponse = require('../utils/errorResponse');

// @desc            Get All Users
// @route           GET '/api/v1/users'
// @access          Public
exports.getUsers = asyncHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        "success": true,
        "data": users
    })
})

// @desc            Get Single User
// @route           GET '/api/v1/users/:id'
// @access          Public
exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        next(new ErrorResponse(`User not found for Id ${req.params.id}`, 404));
    }
    res.status(200).json({
        "success": true,
        "data": user
    })

})

// @desc            Create a User
// @route           POST '/api/v1/users'
// @access          Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        "success": true,
        "data": user
    })
})

// @desc            Update Single User
// @route           PUT '/api/v1/users/:id'
// @access          Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        next(new ErrorResponse(`User not found for Id ${req.params.id}`, 404));
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        "success": true,
        "data": updatedUser
    })
})

// @desc            Delete Single User
// @route           DELETE '/api/v1/users/:id'
// @access          Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        next(new ErrorResponse(`User not found for Id ${req.params.id}`, 404));
    }

    await User.findByIdAndDelete(req.params.id, req.body);
    res.status(200).json({
        "success": true,
        "data": `User with Id ${req.params.id} is deleted!`
    })
})