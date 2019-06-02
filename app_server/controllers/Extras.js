var mongoose = require('mongoose');
var express = require('express');
let User = require('../models/entity');
const bcrypt = require('bcryptjs');




module.exports.login = function (req, res) {

  const ID = req.body.ID;
  const password = req.body.password;

  // temporary
  // id = ID.toString().toLowerCase();
  // if (id === 'admin'){
  //   res.redirect('/AdminPanel');
  // }
  // else if ( id === 'hec'){
  //   res.redirect('/HEC/home');
  // }
  // else{
  //   res.redirect('/Institute/landing');
  // }
  console.log(ID);

  User.findOne({
    ID: ID
  }).exec(function (err, user) {
    if (err) {
      console.log(err);

    } else if (!user) {
      console.log("User not registered");
      res.redirect('/SignIn', 205);
    } else {
      console.log("User exists");


      bcrypt.compare(password, user.Password, function (err, hashCheck) {
        if (err) {
          throw (err);
        }
        if (hashCheck) {
          req.session.uid = user._id;

          if (user.tier == 1) {
            req.session.uid = user._id;
            req.session.name = user.ID;
            req.session.tier = user.tier;
            res.redirect('/Admin/home');
          }
          else if (user.tier == 2) {
            req.session.uid = user._id;
            req.session.name = user.ID;
            req.session.tier = user.tier;
            res.redirect('/HEC/home');
          } 
          else {  //user.tier == 3
            req.session.uid = user._id;
            req.session.name = user.ID;
            req.session.tier = user.tier;
            user.updateOne({
              $inc: {
                Activity: 1
              }
            }, {
              new: true
            }, (err, doc) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              console.log("--------------");
              console.log(user.Activity);
              console.log("--------------");

              req.session.Activity = user.Activity;
              if (user.Activity == 0) {
                res.redirect('/Institute/landing');
              } else {
                res.redirect('/Institute/Dashboard');
              }
            });
          }
        } else {
          console.log('Incorrect Password!');
          res.redirect('/SignIn', 205);
        }
      });
    }
  });

}
module.exports.logout = function (req, res) {
  console.log("Session Closing")
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
}