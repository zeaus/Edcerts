var mongoose = require('mongoose');
var express = require('express');
var entity = require('../models/entity');
var admin_ca = require('../models/admin_ca');

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
      }
    });

    // Saving association of admin with central authority
    let new_admin_ca = new admin_ca({
      admin_id: req.session.uid,
      ca_id: newUser._id
    })

    new_admin_ca.save(function (err) {
      if (err) {
        throw err;
      } else {
        res.redirect('/Admin/home/ListOfCentralAuthorities');
      }
    });
  });
};


module.exports.ShowCentralAuthorityList = function (req, res) {
  console.log("The logged in ID is:\t", req.session.uid);
  admin_ca.find({admin_id: req.session.uid}, {ca_id: 1, _id: 0}, function (err, res_ca_ids){
    if (err)
      throw err;
    final_res = res_ca_ids.map( function(u) { return u.ca_id; } );
    console.log("admin_ca\t", final_res);
    entity.find({_id: final_res}, function (err, result) {
      if (err)
        throw err;
      res.render('Admin/ListOfCentralAuthorities', {
        result
      });
    });
  })
};

module.exports.deleteCentralAuthority=function(req,res)
{
  entity.findOne({ID:req.params.id}, {_id: 1}, function (err, result_id) {
    id_to_delete = result_id._id;
    console.log("Id of Entity to be deleted:\t", id_to_delete);
    entity.findOne({_id: id_to_delete}, function(err, result_del) {
      result_del.remove();
    });
    admin_ca.findOne({ca_id:id_to_delete}, function (err, result_del) {
  
      result_del.remove(); 
      console.log(" deleted" );
      res.send('{"success" : "Updated Successfully", "status" : 200}')
    });
  });
};