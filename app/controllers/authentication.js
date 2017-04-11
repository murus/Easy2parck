    var jwt = require('jsonwebtoken');
    var User = require('../models/user');
    var authConfig = require('../../config/auth');


    function generateToken(user){
        return jwt.sign(user, authConfig.secret, {
            expiresIn: 10080
        });
    }

    function setUserInfo(request){
        return {
            _id: request._id,
            email: request.email
        };
    }

    exports.login = function(req, res, next){

        var tag = req.body.tag;
        var email = req.body.email;
        var password = req.body.password;

        if(!tag){
            return res.status(201).send({error: 'Tag is missing'});
        }

        if(tag == "fb" || tag =="gplus") {

          User.findOne({
              email: email
          }, function(err, user){

              if(err){
                  return next(err);
              }

              if(!user){
                  return res.status(201).send({error: 'Login failed. Please register!',status:"false"});
              }

              var userInfo = setUserInfo(user);
              res.status(200).json({token: 'JWT ' + generateToken(userInfo), user: userInfo ,status:"true"});
          });

        } else if(tag == "normal") {

          if(!email){
              return res.status(201).send({error: 'You must enter an email address'});
          }

          if(!password){
              return res.status(201).send({error: 'You must enter a password'});
          }

          User.findOne({
              email: email
          }, function(err, user){

              if(err){
                  return next(err);
              }

              if(!user){
                  return res.status(201).send({error: 'Login failed. Please register!',status:"false"});

              }

              user.comparePassword(password, function(err, isMatch){

                  if(err){

                      return next(err);

                      //return done(null, false, {error: 'Login failed. Please try again.'});
                  }

                  if(!isMatch){
                      return res.status(400).send({error: 'Login failed. Incorrect email and password.',status:"false"});


                  }

                  var userInfo = setUserInfo(user);
                  res.status(200).json({status:"true",

                      token: 'JWT ' + generateToken(userInfo),
                      user: userInfo
                  });

              });

          });

        }

    }

    exports.register = function(req, res, next){

        var email = req.body.email;
        var password = req.body.password;
        var number = req.body.number;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var tag = req.body.tag;

        if(!email){
            return res.status(201).send({error: 'You must enter an email address',status:"false"});
        }

        console.log("tag-->"+tag)
        if(tag == "normal") {

            if(!password){
                return res.status(201).send({error: 'You must enter a password',status:"false"});
            }
        }


        if(!number){
            return res.status(201).send({error: 'You must enter a Number',status:"false"});
        }

        if(!firstName){
            return res.status(201).send({error: 'You must enter a First name',status:"false"});
        }

        if(!lastName){
            return res.status(201).send({error: 'You must enter a last name',status:"false"});
        }

        if(!tag){
            return res.status(201).send({error: 'Tag is missing',status:"false"});
        }

        User.findOne({email: email}, function(err, existingUser){

            if(err){
                return next(err);
            }

            if(existingUser){
                return res.status(201).send({error: 'This email address is already in use',status:"false"});

            }

            var user = new User({
                email: email,
                password: password,
                number: number,
                firstName: firstName,
                lastName: lastName,
                tag: tag
            });

            user.save(function(err, user){

                if(err){
                    return next(err);
                }

                var userInfo = setUserInfo(user);

                res.status(200).json({token: 'JWT ' + generateToken(userInfo), user: userInfo,status:"true"})

            });

        });

    }
