const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport strategies setup (Facebook and Twitter)

// Facebook authentication
passport.use(new FacebookStrategy({
    // Your Facebook app credentials
    clientID: 'your_facebook_client_id',
    clientSecret: 'your_facebook_client_secret',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Save the user's Facebook profile to the session
    return done(null, profile);
}));

// Twitter authentication
passport.use(new TwitterStrategy({
    // Your Twitter app credentials
    consumerKey: 'your_twitter_consumer_key',
    consumerSecret: 'your_twitter_consumer_secret',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
    // Save the user's Twitter profile to the session
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes

// Route for serving the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for serving the dashboard page
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Route handlers for Facebook and Twitter authentication

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
