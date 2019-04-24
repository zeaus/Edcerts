var mongoose = require('mongoose');


var CA_InstituteSchema = new mongoose.Schema({
    ca_id: String,
    institute_id: String
});

module.exports = mongoose.model('ca_institute', CA_InstituteSchema);