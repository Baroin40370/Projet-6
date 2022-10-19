/*Importation du module jsonwebtoken */
const jwt = require('jsonwebtoken');

 /* J'extrais le token du header 'authorization' de la requète entrante, 
j'utilise la fonction split afin de tout récupèrer après l'espace dans
le header,Les erreurs générées ici s'afficheront dans le bloc catch. 
Avec la fonction vérify de je décode le token, Si celui-ci n'est pas valide,
une erreur sera générée. 
J'extrais l'ID utilisateur et l'ajoute a l'objet request.
Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. 
Je passe à l'exécution à l'aide de la fonction next()*/
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};