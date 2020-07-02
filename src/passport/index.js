const passport = require("passport");
const FacebookStrategy = require("./facebook");

passport.use(FacebookStrategy);
module.exports = passport;
