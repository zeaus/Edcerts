var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


var EntitySchema = new mongoose.Schema({
    ID: String, //Name
    Password: String,
    tier: Number,
    Activity:{type:Number, default:0},
    Name:String,
    PublicKey:{type:Number, default:""}
});

module.exports = mongoose.model('Entity',EntitySchema);


// entity = mongoose.model('Entity',EntitySchema);

// bcrypt.hash('12345', 10, function (err, hash) {
//     let newUser = new entity({
//       ID: 'Admin',
//       Password: hash,
//       tier: 1,
//       Name:'Admin'
//     });
  
//     newUser.save(function (err) {
//       if (err) {
//         throw err;
//       }
//     });
// });