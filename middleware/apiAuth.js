const Person = require('../models/Person');

module.exports = (req, res, next) => {
  const email = req.query.email;
  const token = req.query.token;
  if (email == undefined | token == undefined) {
    res.status(401).json("email or token empty")
  }
  Person.query().findOne({ email: email })
    .then(user => {
      if (!user) {
        res.status(401).json("Invalid email")
      } else
        if (token != user.token) {
          res.status(401).json("token empty or not valid")
        }
    })
    .catch(err => console.log(err));
  next();
} 