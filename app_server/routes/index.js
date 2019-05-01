var express = require('express');
var router = express.Router();
var extras = require('../controllers/Extras')
var HEC = require('../controllers/HEC')
var Admin = require('../controllers/Admin')
var Institute = require('../controllers/Institute')
const bcrypt = require('bcryptjs');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');


var storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storageUser
});

const checkIfLoggedIn = function (req, res, next) {
  if (!req.session.uid)
    res.redirect('/');
  next();
}

const checkIfAdminTier = function (req, res, next) {
  console.log("checkIfAdminTier");
  if (!req.session.uid || req.session.tier != 1)
    res.redirect('/');
  else
    next();
}

const checkIfCATier = function (req, res, next) {
  console.log("checkIfCATier");
  if (!req.session.uid || req.session.tier != 2)
    res.redirect('/');
  else
    next();
}

const checkIfInstituteTier = function (req, res, next) {
  console.log("checkIfInstituteTier");
  if (!req.session.uid || req.session.tier != 3)
    res.redirect('/');
  else
    next();
}
const InitialCredentialUpdate = function (req, res, next) {
  console.log("InitialCredentialUpdate");
  if (!req.session.uid) {
    res.redirect('/');
    if (req.session.Activity != 1)
      res.redirect('/Institute/Dashboard');
  }
  else
    next();
}


// Extras
router.get('/SignIn', function (req, res, next) {
  console.log(req.statusCode);
  res.render('SignIn');
});

router.get('/', function (req, res, next) {
  res.render('Landing');
});

router.post('/login', extras.login);

router.get('/Verify', function (req, res) {
  res.render('verification');
});

router.get('/logout', extras.logout);


// Routes for Admin
router.post('/addCentralAuthority', checkIfAdminTier, Admin.AddCentralAuthority);

router.get('/Admin/home/ListOfCentralAuthorities', checkIfAdminTier, Admin.ShowCentralAuthorityList);

router.delete('/delete/Admin/:id', checkIfAdminTier, Admin.deleteCentralAuthority);

router.get('/Admin/home', checkIfAdminTier, function (req, res) {
  var InstituteName = req.session.name;
  res.render('Admin/Home', {
    InstituteName
  });
});

router.get('/Admin/home/AddCentralAuthority', checkIfAdminTier, function (req, res) {
  res.render('Admin/AddCentralAuthority');
});


// Routes for Central Authority
router.get('/HEC/home', checkIfCATier, function (req, res) {
  var InstituteName = req.session.name;
  res.render('HEC/Home', {
    InstituteName
  });
});

router.post('/addUniversity', checkIfCATier, HEC.AddUni);

router.get('/HEC/home/ListOfUniversities', checkIfCATier, HEC.ShowUniList);

router.get('/HEC/home/AddUniversity', checkIfCATier, function (req, res) {
  res.render('HEC/AddUniversity');
});

router.delete('/delete/HEC/:id', checkIfCATier, HEC.deleteUni);


// Routes for Institute
router.get('/Institute/landing', checkIfInstituteTier, InitialCredentialUpdate, function (req, res, next) {
  var InstituteName = req.session.name;
  res.render('Institute/landing', {
    InstituteName
  });
});

router.get('/Institute/landing2', checkIfInstituteTier, InitialCredentialUpdate, function (req, res, next) {
  var InstituteName = req.session.name;
  res.render('Institute/landing2', {
    InstituteName
  });
});

router.get('/Institute/Dashboard', checkIfInstituteTier, function (req, res) {
  var InstituteName = req.session.name;
  res.render('Institute/Dashboard', {
    InstituteName
  });
});

router.get('/Institute/Recipients', checkIfInstituteTier, Institute.loadRecepient);

router.get('/Institute/Certificate/Issued', function (req, res) {
  var InstituteName = req.session.name;
  res.render('Institute/CertificateIssued', {
    InstituteName
  });
});

router.get('/Institute/Certificate/Draft', checkIfInstituteTier, Institute.DraftCertificate);

router.get('/Institute/Certificate/:id', checkIfInstituteTier, Institute.loadCertificate);

router.post('/IssueCertificates', checkIfInstituteTier, Institute.IssueCertificates);

router.post('/CreateDegree', checkIfInstituteTier, Institute.CreateDegree);

router.post('/uploadRecipient', checkIfInstituteTier, upload.single('file'), Institute.uploadRecepient);

router.post('/SetPassword', checkIfInstituteTier, Institute.setPassword);

router.patch('/UpdatePublicKey/:id/:pkey', checkIfInstituteTier, Institute.UpdatePublicKey);

router.get('/GetCertificate/:pkey', checkIfInstituteTier, Institute.GetCertificates);


module.exports = router;