'use strict';

const passport = require("passport");
// if you import passport in 2 different files, the SAME instance is available in the other file!
// ** just because you are importing here, it doesn't mean you have 2 instances running!

const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);    // whenever you want to store the user in your session, serialize it by ID.
});   // tells passport how to store the user in the session

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use("local.signup", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    // Perform basic validation
    req.checkBody('email', 'Invalid email').notEmpty().isEmail(); 
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4}); 
    let errors = req.validationErrors();

    if (errors) {
        let messages = [];
        errors.forEach((err) => {
            messages.push(err.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'Email en uso.'});
        }
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result) => {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        })
    });
}));

passport.use("local.signin", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
      // Perform basic validation
      req.checkBody('email', 'Email Incorrecto').notEmpty().isEmail();
      req.checkBody('password', 'Password Incorrecto').notEmpty();
      let errors = req.validationErrors();

      if (errors) {
        let messages = [];
          errors.forEach((err) => {
              messages.push(err.msg);
          });
          return done(null, false, req.flash('error', messages));
      }

      User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No se encuentra el usuario.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Password Incorrecto.'});
        }

        return done(null, user);
    });
}));
