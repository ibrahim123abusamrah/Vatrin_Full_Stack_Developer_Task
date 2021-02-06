const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const auth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  [
    check('firstName').not().isEmpty().withMessage('First Name is required'),
    check('lastName').not().isEmpty().withMessage('Last Name is required'),
    check('email', 'Email is required').isEmail(),
    check('password').not().isEmpty().withMessage('password is required'),
    check('password', 'Password must be more than 8 charcher').isLength({ min: 8 }),
  ]
  ,
  authController.postSignup
);

router.post('/login',
  [
    check('email').not().isEmpty().withMessage('email is required'),
    check('password').not().isEmpty().withMessage('password is required')]
  , authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/profile', auth, authController.Profile);

module.exports = router;