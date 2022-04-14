const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const ErrorResponse = require('../utils/errorResponse');

// @desc            Register User
// @route           POST '/api/v1/auth/register'
// @access          Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    // Send token response using helper method 
    sendTokenResponse(user, 200, res);


    res.status(200).json({
        success: true,
        token
    });
})


// @desc            Login User
// @route           POST '/api/v1/auth/login'
// @access          Public
exports.login = asyncHandler(async (req, res, next) => {


    // Check email and password validation
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password!', 400));
    }

    // Check email is valid 
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentails!', 401));
    }

    // check plain password with its hashed version on database
    const isMatch = user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentails!', 401));
    }

    // Send token response using helper method 
    sendTokenResponse(user, 200, res);

})

// Generate token and send across the cookie
const sendTokenResponse = (user, statusCode, res) => {

    // Create Token
    // Schema method will be called on response received from Schema
    const token = user.getJWT();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            succes: true,
            token
        })
}