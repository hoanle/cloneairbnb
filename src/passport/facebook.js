const strategy = require('passport-facebook')
const FacebookStrategy = strategy.Strategy

module.exports = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "email", "name", 'picture']
}, function(accessToken, refreshToken, profile, next){
    console.log(profile)
    next(null, profile)
}) 