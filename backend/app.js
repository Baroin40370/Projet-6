const express = require('express');
const bodyParser = require('body-parser');

/*Importation des modules*/
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

/*Importation des router */
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

/*Je me connecte à la base de donnée avec mes identifiants */
mongoose.connect('mongodb+srv://torai:ma195105@cluster0.wkxrx8i.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  /*Création de l'application express */
  const app = express();
  app.use(helmet());
  
  /*Avec le premier header j'autorise:
  L'accès à n'importe quelle origine avec '*',
  L'utilisation des headers mentionnés aux requêtes envoyées vers l'API,
  D'envoyer des requêtes avec les méthodes mentionnées,
  Les requêtes de n'importe quelle origine  
  */
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  

/*J'enregistre les router */

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes); 
app.use('/api/sauces', sauceRoutes); 
  
module.exports = app;