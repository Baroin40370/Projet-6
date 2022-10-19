const mongoose = require('mongoose');
/*Création d'un schéma de données, il n'y a pas de champ pour l'id 
puisqu'il est automatiquement généré par Mongoose */
const sauceSchema = mongoose.Schema({
  userId : { type : String, required: true},
  name : { type: String, required: true },
  manufacturer:{ type: String, required: true },
  description: { type: String, required: true },
  mainPepper : { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default:0 },
  dislikes: { type: Number, default:0 },
  usersLiked: { type: Array, required: true, default: [''] },
  usersDisliked: { type: Array, required: true, default: [''] }
});

/*J'exporte le schéma */
module.exports = mongoose.model('sauce', sauceSchema);