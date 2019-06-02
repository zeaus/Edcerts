var mongoose = require('mongoose');


var StudentSchema = new mongoose.Schema({
    data:[JSON],
    InstituteID:String,
    Name:String
    
});

module.exports = mongoose.model('student',StudentSchema);