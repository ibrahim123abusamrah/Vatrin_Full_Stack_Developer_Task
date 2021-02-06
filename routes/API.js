const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authApi = require('../middleware/apiAuth')
//  reading (all and by id)
router.get('/persons', authApi, function (req, res, next) {
  if (req.query.id == undefined) {
    Person
      .query()
      .then(function (persons) { return res.status(202).json(persons); })
      .catch(next);
  } else {
    Person
      .query().findOne({ id: req.query.id })
      .then(function (persons) { return res.status(202).json(persons); })
      .catch(next);
  }
});

//API for creating  persons
router.post('/persons', authApi, function (req, res, next) {
  Person
    .query()
    .insertAndFetch(req.body)
    .then(function (person) { return res.status(202).json(person); })
    .catch(next);
});

//API for delete  persons
router.delete('/persons/:id', authApi, function (req, res, next) {
  Person
    .query()
    .deleteById(req.params.id)
    .then(function () { return res.status(202).json("Done"); })
    .catch(next);
});


//API for updating  person by id
router.patch('/persons/:id', authApi, function (req, res, next) {
  Person
    .query()
    .patchAndFetchById(req.params.id, req.body)
    .then(function () { return res.status(202).json("Done"); })
    .catch(next);
});

//API for make login and get token  
router.post('/persons/login', function (req, res, next) {
  const email = req.query.email;
  const password = req.query.password;
  Person.query().findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json("Invalid email or password.")
      }
      bcrypt
        .compare(password, user.hashPassword)
        .then(async doMatch => {
          if (doMatch) {
            let token = jwt.sign({ iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
            await Person.query()
              .patchAndFetchById(user.id, { token: token })
              .then(function (person) {
                res.setHeader('content-type', 'application/json')
                return res.status(200).json({ "token : ": token })
              })
              .catch(next);
          }
          return res.status(401).json("'Invalid email or password.'")
        })
        .catch(err => {
          return res.status(500).json(err);
        });
    })
    .catch(err => res.status(500).json(err));
});

//API for make logout and distroy token  
router.post('/persons/logout', function (req, res, next) {
  const email = req.query.email;
  const password = req.query.password;
  Person.query().findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json("Invalid email or password.")
      }
      bcrypt
        .compare(password, user.hashPassword)
        .then(doMatch => {
          if (doMatch) {
            Person.query()
              .patchAndFetchById(user.id, { "token": "NULL" })
              .then()
              .catch(next);
          }
          return res.status(200).json("Logut done")
        })
        .catch(err => {
          return res.status(500).json(err);
        });
    })
    .catch(err => res.status(500).json(err));
});
module.exports = router;