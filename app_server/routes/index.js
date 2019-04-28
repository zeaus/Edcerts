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
    //console.log(req.file);
    // console.log(file);
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

const InitialCredentialUpdate = function (req, res, next) {
  if (!req.session.uid) {
    res.redirect('/');
    if (req.session.Activity != 1)
      res.redirect('/Institute/Dashboard');
  }
  next();
}


router.get('/SignIn', function (req, res, next) {
  console.log(req.statusCode);
  res.render('SignIn');
});

router.get('/', function (req, res, next) {
  res.render('Landing');
});

router.post('/login', extras.login);

router.get('/Institute/landing', InitialCredentialUpdate, function (req, res, next) {
  var InstituteName = req.session.name;
  res.render('Institute/landing', {
    InstituteName
  });
});
router.get('/Institute/landing2', InitialCredentialUpdate, function (req, res, next) {
  var InstituteName = req.session.name;
  res.render('Institute/landing2', {
    InstituteName
  });
});

router.post('/IssueCertificates', Institute.IssueCertificates)

router.post('/addUniversity', HEC.AddUni);

router.post('/CreateDegree', Institute.CreateDegree)

// For Admin
router.post('/addCentralAuthority', Admin.AddCentralAuthority);

router.get('/Admin/home/ListOfCentralAuthorities', checkIfLoggedIn, Admin.ShowCentralAuthorityList);

router.delete('/delete/Admin/:id', Admin.deleteCentralAuthority);

router.get('/Admin/home', checkIfLoggedIn, function (req, res) {
  var InstituteName = req.session.name;
  res.render('Admin/Home', {
    InstituteName
  });
})

router.get('/Admin/home/AddCentralAuthority', checkIfLoggedIn, function (req, res) {
  res.render('Admin/AddCentralAuthority');
})


router.get('/HEC/home', checkIfLoggedIn, function (req, res) {
  var InstituteName = req.session.name;
  res.render('HEC/Home', {
    InstituteName
  });
})


router.get('/Institute/Dashboard', checkIfLoggedIn, function (req, res) {
  var InstituteName = req.session.name;
  res.render('Institute/Dashboard', {
    InstituteName
  });
})

router.get('/Institute/Recipients', checkIfLoggedIn, Institute.loadRecepient);

router.get('/Institute/Certificate/Issued', function (req, res) {
  var InstituteName = req.session.name;
  res.render('Institute/CertificateIssued', {
    InstituteName
  });
})
router.get('/Institute/Certificate/Draft', Institute.DraftCertificate);


router.get('/Institute/Certificate/:id', checkIfLoggedIn, Institute.loadCertificate);



router.get('/HEC/home/ListOfUniversities', checkIfLoggedIn, HEC.ShowUniList);


router.post('/addUniversity', HEC.AddUni);


router.get('/HEC/home/AddUniversity', checkIfLoggedIn, function (req, res) {
  res.render('HEC/AddUniversity');
})

router.get('/Verify', function (req, res) {
  res.render('verification');

});


router.get('/Verify', function (req, res) {
  res.render('verification');

});

router.post('/uploadRecipient', upload.single('file'), Institute.uploadRecepient);

router.post('/SetPassword', Institute.setPassword)



router.get('/logout', extras.logout);
router.delete('/delete/HEC/:id', HEC.deleteUni);

router.patch('/UpdatePublicKey/:id/:pkey',Institute.UpdatePublicKey)
router.get('/GetCertificate/:pkey',Institute.GetCertificates)
module.exports = router;