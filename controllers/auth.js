const bcrypt = require('bcryptjs');

const Person = require('../models/Person');
const { validationResult } = require('express-validator');

// get login page
exports.getLogin = (req, res, next) => {
  let message = "";
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.status(200).render('auth/login', {
    path: 'auth/login',
    pageTitle: 'Login',
    errorMessage: message,
    isLogin: false
  });
};

// get profile page
exports.Profile = (req, res, next) => {
  res.status(200).render('auth/profile', {
    path: '/auth/profile',
    pageTitle: 'profile',
    Person: req.session.Person,
    isLogin: true
  });
};

// get signup page
exports.getSignup = (req, res, next) => {
  let message = "";
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.status(200).render('auth/signup', {
    path: '/auth/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    isLogin: false

  });
};

// post Login page
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  //if any not valid in front end display it 
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      isLogin: false,
      errorMessage: errors.array()[0].msg
    });
  }
  Person.query().findOne({ email: email })
    .then(user => {
      if (!user) {
        //if user not found
        return res.status(200).redirect('/users/login');
      }
      bcrypt
        .compare(password, user.hashPassword)
        .then(doMatch => {
          if (doMatch) {
            // if password is true
            req.session.isLoggedIn = true;
            req.session.Person = user;
            console.log(req.session)
            return req.session.save(err => {
              this.Profile(req, res)
            });
          }
          res.status(200).redirect('/users/login');
        })
        .catch(err => {
          console.log(err);
          res.status(200).redirect('/users/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isLogin: false,
      errorMessage: errors.array()[0].msg
    });
  }
  Person.query().findOne({ email: email })
    .then(PersonDoc => {
      if (PersonDoc) {
        return res.status(200).render('auth/signup', {
          path: '/auth/signup',
          pageTitle: 'Signup',
          errorMessage: "exist user try another email",
          isLogin: false
      
        });
      }
      return bcrypt.hash(password, 12).then(async hashedPassword => {
        const jennifer = await Person.query().insert({
          email: email,
          firstName: firstName,
          lastName: lastName,
          hashPassword: hashedPassword
        });
      })
        .then(result => {
          res.status(200).redirect('/users/login');
        })
        .catch(err => {
          console.log(err);
        });
    })
};
// post logout page
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/users/login');
  });
};