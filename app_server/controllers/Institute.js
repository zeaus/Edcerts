var mongoose = require('mongoose');
var express = require('express');
var User = require('../models/entity');
var certificate = require('../models/certificate');
const bcrypt = require('bcryptjs');
var XLSX = require('xlsx')
var recepient = require('../models/recepient');
var blockchain=require('../controllers/BlockChain')


module.exports.UpdatePublicKey=function(req,res)
{
    const id = req.params.id;
    const pkey=req.params.pkey;

    console.log("id",id);
    console.log("pkey",pkey);
    

    res.send(200)
}


module.exports.GetCertificates=function(req,res)
{
    
    const pkey=req.params.pkey;
    console.log("get certificate called");   
    console.log("pkey",pkey);
    
    cert1={ Recepient: 'Hashir Baig',
    'Last Name': 'Baig',
    CGPA: 2.9,
    'Date of Graduation': 43470,
    Batch: 2015,
    Email: 'Hashirbaig@gmail.com',
    Program: 'BSAF',
    Institution: 'FAST',
    'Public Key': '0x6e6F07247161E22E1a259196F483cCEC21dfBfF9' }

    cert=[]
    cert.push(cert1);
    cert.push(cert1);
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cert));

    
}



module.exports.CreateDegree = function (req, res) {
    const title = req.body.title;
    var newcertificate = new certificate({
        Title: title,
        Fields: req.body.feature
    });

    newcertificate["DateofCreation"] = Date.now();
    console.log(newcertificate);
    newcertificate.save();
    res.redirect('/Institute/Certificate/Draft');
}
module.exports.DraftCertificate = function (req, res) {
    certificate.find({}, function (err, degree) {
        var InstituteName = req.session.name;
        res.render('Institute/CertificateDraft', {
            degree,
            InstituteName
        })
    })
}
module.exports.loadCertificate = function (req, res) {
    certificate.findById(req.params.id, function (err, degree) {
        recepient.find({
            InstituteID: req.session.uid
        }, (err, recep) => {

            var InstituteName = req.session.name;

            res.render('Institute/Certificate', {
                degree,
                recep,
                InstituteName
            });
        })
    });


}

module.exports.setPassword = function (req, res) {

    bcrypt.hash(req.body.password2, 10, function (err, hash) {
        if (err) {
            console.log(err);
            throw err;
        }
        User.findOneAndUpdate({
            _id: req.session.uid
        }, {
            $set: {
                Password: hash
            }
        }, (error, result) => {
            if (error)
                console.log(error);

        });

        res.redirect('/Institute/landing2');
    });

}

module.exports.uploadRecepient = function (req, res) {

    console.log("in server side of upload ercep");

    var workbook = XLSX.readFile('./public/Uploads/' + req.file.filename);
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(xlData);


    console.log(xlData.length)
    /*
    var wb = XLSX.readFile("./public/Uploads/"+req.file.filename);
    console.log(wb);*/

    let newRecepient = new recepient({
        Status: "Pending",
        Records: xlData.length,
        FilePath: req.file.filename,
        IssueDate: Date.now(),
        InstituteID: req.session.uid,
        Name: req.file.filename.slice(0, -5)

    });

    newRecepient.save(function (err, result) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(result);

            res.send({
                result
            });
        }
    });

}



module.exports.loadRecepient = function (req, res) {
    recepient.find({
        InstituteID: req.session.uid
    }, (err, recep) => {

        var InstituteName = req.session.name;

        res.render('Institute/Recipients', {
            recep,
            InstituteName
        });
    })


}


module.exports.IssueCertificates = function (req, res) {
    console.log(req.body.templateid);
    var path = req.body.recepient + ".xlsx";
    console.log(path);

    var workbook = XLSX.readFile('./public/Uploads/' + req.body.recepient + ".xlsx");
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    certificate.findById({
        _id: req.body.templateid
    }, function (err, result) {
        if (err) {
            console.log(err);
            throw err;
        }



        var JSONDATA = [];


        for (let index = 0; index < xlData.length; index++) {

            var temp = {};
            const element = xlData[index];

            result.Fields.forEach((attribute) => {
                var columnName = attribute;
                temp[columnName] = element[attribute];
            });
            temp['Public Key'] = "0x6e6F07247161E22E1a259196F483cCEC21dfBfF9"
            JSONDATA.push(temp);

        };
        console.log(JSONDATA);

        const root = blockchain.computeMerkleRoot(JSONDATA, "Data.xlsx") 
        console.log(root)

        console.log("Publishing root on Blockchain")
        const txid = blockchain.publishOnBlockchain(root,5)
        console.log(txid)
    })
    res.redirect('back')
}

module.exports.sendEmail = function (req, res) {
    console.log("Send Email!");
    res.redirect('/Institute/Recipients')
}