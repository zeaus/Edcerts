var mongoose = require('mongoose');
var express = require('express');
var entity = require('../models/entity');

const bcrypt = require('bcryptjs');


module.exports.AddCentralAuthority = function (req, res) {
  const name = req.body.ID;
  const password = req.body.password;
  const email=req.body.email;
  
  bcrypt.hash(password, 10, function (err, hash) {
  let newUser = new entity({
    ID: name,
    Password: hash,
    tier: 2,
    Name:name
  });

  newUser.save(function (err) {
    if (err) {
      throw err;
    } else {
      res.redirect('/Admin/home/ListOfCentralAuthorities');

    }
  });


  });



};


module.exports.ShowCentralAuthorityList = function (req, res) {
  entity.find({tier: 2}, function (err, result) {
    if (err)
      throw err;

    res.render('Admin/ListOfCentralAuthorities', {
      result
    });

  })
};

module.exports.deleteCentralAuthority=function(req,res)
{
  entity.findOne({ID:req.params.id}, function (err, result) {
  
    result.remove();  
    console.log(" deleted" );
    res.send('{"success" : "Updated Successfully", "status" : 200}')

  });
}