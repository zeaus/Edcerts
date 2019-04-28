var mongoose = require('mongoose');


var CA_InstituteSchema = new mongoose.Schema({
    ca_id: String,
    institute_id: String
});

module.exports = mongoose.model('Ca_institute', CA_InstituteSchema);