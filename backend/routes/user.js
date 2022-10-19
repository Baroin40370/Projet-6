/*J'importe express */
const express = require('express');
/*Creation des routeurs */
const router = express.Router();
/*J'importe le controller */
const userCtrl = require('../controllers/user');
/*j'enregistre ensuite les routes individuelles */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
