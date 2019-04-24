var mongoose = require('mongoose');


var RecepientSchema = new mongoose.Schema({
    Status:String,
    Records:{type:Number, default:0},
    Name:String,
    IssueDate:Date,
    InstituteID:String,
    FilePath:String,
    UploadDate:Date
});

module.exports = mongoose.model('recepient',RecepientSchema);