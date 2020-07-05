const AppError = require("./../error/appError");
const { catchAsync } = require("./../error/errorController");
const Tag = require("./tagModel");

exports.getTagList = catchAsync(async (request, response, next) => {
    const tagList = await Tag.find({}).limit(20);
    console.log(tagList);
    response.status(200).json({
        status: 'success',
        data: tagList
    })
})