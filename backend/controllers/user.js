/*Importation du package de cryptage 'bcrypt'  */
const bcrypt = require('bcrypt');

/*Importation du package 'jsonwebtoken' */
const jwt = require ('jsonwebtoken');

const User = require('../models/user');

/*J'appelle la fonction de hachage de 'bcrypt' dans le mot de passe 
et lui demande de « hacher » le mot de passe 10 fois
dans le bloc then , je créer un utilisateur et l'enregistre dans la base
de données, en renvoyant une réponse de réussite en cas de succès, 
et d'erreur en cas d'échec.  */
exports.signup = (req, res, next) => {
   bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
         email: req.body.email,
         password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => {
            res.status(400).json({ error });
            console.log(error);
        });
      })
      .catch(error => {
            res.status(500).json({ error });
            console.log(error);
        });
     };

/*J'utilise le 'models/user' pour vérifier que l'e-mail entré par l'utilisateur
correspond à un utilisateur existant de la base de données Dans le cas contraire,
je renvoie une erreur, si l'e-mail correspond à un utilisateur existant j'utilise
le fonction 'compare' de bcrypt pour comparer le mot de passe entré par
l'utilisateur avec le hash enregistré dans la base de données
S'ils ne correspondent pas, je renvoie une erreur avec le même message que lorsque 
l’utilisateur n’a pas été trouvé, afin de ne pas laisser quelqu’un vérifier si 
une autre personne est inscrite sur le site
S'ils correspondent, les informations d'identification de notre utilisateur sont 
valides. Dans ce cas, je renvoie une réponse 200, j'utilise la fonction 'sign' 
de jsonwebtoken pour chiffrer un nouveau token.
Ce token contient l'ID de l'utilisateur en tant que données encodées dans le token
j'utilise 'RANDOM_TOKEN_SECRET'pour crypter le token et je définit la validitée 
du token a 24h*/
     exports.login = (req, res, next) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
     };


