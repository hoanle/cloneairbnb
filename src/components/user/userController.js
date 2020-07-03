const { catchAsync } = require("./../error/errorController");
const AppError = require("./../error/appError");
const User = require("./userModel");
const faker = require("faker");

exports.createUser = catchAsync(async (request, response, next) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return next(new AppError(400, "Param is missing"));
  }

  const user = await User.findOrCreateOne(request.body);
  const token = await user.generateToken();
  response.status(200).json({
    status: "success",
    data: { user, token },
  });
});

exports.getUserList = catchAsync(async (request, response, next) => {
  const { role } = request.body
  const query = (role) ? {role: role} : {} 
  const userList = await User.find(query).limit(20);
  response.status(200).json({
    status: 'success', 
    data: { userList }
  })
});

exports.fakeUsers = catchAsync(async (request, response, next) => {
  let i = 1;
  let { role, number } = request.body;
  if (!role) role = "user";

  if (!number) number = 10;

  const intervalId = setInterval(async () => {
    if (i < number) {
      i++;
      try {
        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: "123456789",
          role: role,
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
