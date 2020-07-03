const strategy = require('passport-google-oauth20')
const GoogleStrategy = strategy.Strategy

module.exports = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        profileFields: ["id", "email", "name"]
    },
    function(accessToken, refreshToken, profile, next) {
        console.log(profile)
        next(null, profile)
    }
)