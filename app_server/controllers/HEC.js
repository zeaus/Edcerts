var mongoose = require('mongoose');
var express = require('express');
var entity = require('../models/entity');
var ca_institute = require('../models/ca_institute');

const bcrypt = require('bcryptjs');


module.exports.AddUni = function (req, res) {
  const name = req.body.ID;
  const password = req.body.password;
  const email=req.body.email;
  
  bcrypt.hash(password, 10, function (err, hash) {
  let newUser = new entity({
    ID: name,
    Password: hash,
    tier: 3,
    Name:name
  });
  
  newUser.save(function (err) {
    if (err) {
      throw err;
    }
  });

  // Saving association of central authority with institute
  let new_ca_institute = new ca_institute({
    ca_id: req.session.uid,
    institute_id: newUser._id
  })

  new_ca_institute.save(function (err) {
    if (err) {
      throw err;
    } else {
      res.redirect('/HEC/home/ListOfUniversities');
    }
  });


  });

};


module.exports.ShowUniList = function (req, res) {
  console.log("The logged in ID is:\t", req.session.uid);
  ca_institute.find({ca_id: toString(req.session.id)}, function (err, res){
    console.log("ca_institute\t", res);
  });
  entity.find({tier: 3}, function (err, result) {
    if (err)
      throw err;

    res.render('HEC/ListOfUniversities', {
      result
    });

  
})



}

module.exports.deleteUni=function(req,res)
{
  entity.findOne({ID:req.params.id}, function (err, result) {
  result.remove();
  
  console.log(" deleted" );
  res.send('{"success" : "Updated Successfully", "status" : 200}')

  });
}




// entity.find({tier: 3}, function (err, result) {
//   if (err)
//     throw err;

//   res.render('HEC/ListOfUniversities', {
//     result
//   });