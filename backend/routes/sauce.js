/*J'importe express */
const express = require('express');
/*Création des routeurs */
const router = express.Router();

/*J'importe mon middleware 'auth' */
const auth = require('../middleware/auth');

/*J'importe mon middleware 'multer-config'*/
const multer = require("../middleware/multer-config");

/*J'importe le controller */
const sauceCtrl = require('../controllers/sauce');

/*j'enregistre ensuite les routes individuelles, je protège mes routes avec 
mon middleware 'auth' en le passant comme argument, et 'multer' sur les routes
post et put afin que le téléchargement de fichiers fonctionne */
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer,sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like' ,auth, sauceCtrl.likeDislikeSauce);
module.exports = router;