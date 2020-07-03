const passport = require("passport");
const FacebookStrategy = require("./facebook");
const GoogleStrategy = require("./google");

passport.use(FacebookStrategy);
passport.use(GoogleStrategy);

module.exports = passport;
