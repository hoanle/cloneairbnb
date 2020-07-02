const { catchAsync } = require('./../error/errorController');
const AppError = require('./../error/appError');
const User = require('./../user/userModel');
const bcrypt = require('bcrypt');

exports.login = catchAsync(async (request, response, next) => {
    const { email, password } = request.body;
    
    if (!email || !password) {
        return next(new AppError(400, 'Email or password is missing'));
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new AppError(400, `Can not find user with email ${email}`));
    }
    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
        return next(new AppError(400, 'Password is incorrect'));
    }

    const token = await user.generateToken();
    response.status(200).json({
        status: 'success', 
        data: { user, token }
    })
});