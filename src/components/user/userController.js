const { catchAsync } = require("./../error/errorController");
const AppError = require("./../error/appError");
const User = require("./userModel");
const faker = require("faker");
const { sendVerificationEmail } = require('./../../services/mailgunService');
const cloudinary = require("./../../services/cloudinary");

exports.createUser = catchAsync(async (request, response, next) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return next(new AppError(400, "Param is missing"));
  }
  const permits = User.permits(request.body);
  const user = await User.create({...permits, role: "user" });
  const token = await user.generateToken();
  const verificationToken = await user.generateVerificationToken();
  sendVerificationEmail(email, verificationToken);

  if (request.files && request.files.length > 0) {
    let avatar = await cloudinary.uploadSingleFile(request.files[0].path, "Images");
    user.avatar = avatar;
    user.save();
  }

  response.status(200).json({
    status: "success",
    data: { user, token },
  });
});

exports.getUserList = catchAsync(async (request, response, next) => {
  const { role } = request.query;
  const query = role ? { role: role } : {};
  const userList = await User.find(query).limit(40).sort({ _id: -1 });
  response.status(200).json({
    status: "success",
    data: { userList },
  });
});

exports.fakeUsers = catchAsync(async (request, response, next) => {
  let i = 1;
  let { role, number } = request.body;
  if (!role) role = "user";

  if (!number) number = 10;
  let introduction = "";
  if (role === "host") {
    introduction = faker.lorem.paragraph();
  }

  const intervalId = setInterval(async () => {
    if (i < number) {
      i++;
      try {
        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: "123456789",
          role: role,
          introduction: introduction,
        });
      } catch (error) {
        console.log();
      }
    } else {
      clearInterval(intervalId);
      response.status(200).json({
        status: "success",
        message: `Created ${number} users`,
      });
    }
  }, 1000);
});
