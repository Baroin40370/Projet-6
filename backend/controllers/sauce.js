const Sauce = require('../models/sauce');
/*Importation du package fs */
const fs = require('fs');
const { error } = require('console');
const sauce = require('../models/sauce');

/*Pour afficher toutes les sauces:
J'utilise le méthode find dans mon model mongoose afin de renvoyer un tableau
contenant tous les objets dans la base de donnée */
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

/* Pour trouver une sauce:
J'utilise la méthode findOne afin de trouver l'objet ayant le même _id 
que le paramètre de la requête, l'objet est ensuite retourné dans une 
Promise et envoyé au front-end, si aucun objet correspondant est trouvé ou
si une erreure c'est produite on retourne une erreur au front-end */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
     _id: req.params.id
   }).then(
     (sauce) => {
       res.status(200).json(sauce);
     }
   ).catch(
     (error) => {
       res.status(404).json({
         error: error
       });
     }
   );
 };
 
/*Pour créer une sauce :
Je commence par analyser l'objet de la requête avec JSON.parse pour obtenir 
un objet utilisable, je supprime le champ _userId pour des raisons de sécurité
je le remplace en base de donnée par l'userId extrait du token d'autentification
je complete mon url et j'enregistre l'objet dans ma base de donnée avec la 
méthode save. */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce crée avec succès !'})})
  .catch(error => { res.status(400).json( { error })})
};
/*Pour modifier une sauce:
Je commence par créer un objet qui regarde si il y a déja un fichier, si oui 
alors on traite la nouvelle image, sinon on traite l'objet entrant, je supprime 
le _userId envoyé par le client, je vérifie que le client est bien le propriétaire
de l'objet, si non message erreur, si oui je créer une instance de l'objet et 
je supprime l'ancienne image */
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {             
        if (sauce.userId != req.auth.userId) {        
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => {              
              const filename = sauce.imageUrl.split("/images/")[1];
              fs.unlink(`images/${filename}`,()=>{});              
              res.status(200).json({message : 'Sauce modifiée!'});
            })
            .catch(error => {
              console.log(error);
              res.status(400).json({ error });
            });
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};
 
/*Pour supprimer une sauce :
j'utilise _id que je reçois en paramètre pour acceder a la sauce correspondante 
dans le base de donnée, je vérifie que l'utilisateur est bien le propriétaire 
de la sauce si non message d'erreur, si oui je vérifie que mon url contient 
un segment image pour séparer le nom de fichier, j'utilise
la fonction 'unlink' du package fs pour supprimer ce fichier en lui passant le 
fichier à supprimer, dans le callback je supprime l'objet de la base de donnée */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id : req.params.id })
  .then(sauce => {
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({message: 'Not authorized'});
  } else {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
              .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
              .catch(error => res.status(401).json({ error }));
      });
  }
})
.catch( error => {
  res.status(500).json({ error });
});
};

/*Pour liker ou disliker une sauce:
j'utilise _id que je reçois en paramètre pour acceder a la sauce correspondante
je créé deux constantes dans lesquels je stock mon userId inclus dans les tableaux
usersLiked ou usersDisliked, 
case 1 :si mon userId n'est pas inclus 
dans le tableau usersLiked alors je le 'push',likes est égale à 1 
update passe à true
case 0 : si au contraire l'userId est présent dans le tableau je le retire et likes
passe à -1 update devient false, de même pour disliked
case -1 : identique à la première case */

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  Sauce.findOne({_id:sauceId})
  .then(sauce => {
    const liked = sauce.usersLiked.includes(userId);
    const disliked = sauce.usersDisliked.includes(userId);
    let update = false;
    switch (like) {
      case 1 :
        if (!liked) { 
          update = {$push: { usersLiked: userId }, $inc: { likes: 1 }};
        }         
        break;
      case 0:
        if (liked) { 
          update = {$pull: { usersLiked: userId }, $inc: { likes: -1 }};
        } else if (disliked) { 
          update = {$pull: { usersDisliked: userId }, $inc: { dislikes: -1 }};
        }
        break;
      case -1:
        if (!disliked) { 
          update = {$push: { usersLiked: userId }, $inc: { dislikes: +1 }};
        }
        break;    
    }
    if (update) {
      Sauce.updateOne({ _id: sauceId },update)
      .then(() => res.status(200).json({ message:'ok'}))
      .catch((error) => res.status(400).json({ error }))
    } else {
      res.status(400).json({message:'ko'});
    }
  })
  .catch((error) => res.status(404).json({ error }))
}





    
  
