var mongoose = require('mongoose');


var Admin_CASchema = new mongoose.Schema({
    admin_id: String,
    ca_id: String
});

module.exports = mongoose.model('Admin_ca', Admin_CASchema);