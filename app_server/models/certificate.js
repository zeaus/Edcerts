var mongoose = require('mongoose');


var CertificateSchema= new mongoose.Schema({
    Title:String,
    Fields:[String],
    DateofCreation:Date
});

module.exports = mongoose.model('Certificate',CertificateSchema);