/*Importation de mongoose */
const mongoose = require('mongoose');

/*J'importe le module 'mongoose-unique-validator'*/
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
/*J'exporte le schema sous forme de model */
module.exports = mongoose.model('User', userSchema);
