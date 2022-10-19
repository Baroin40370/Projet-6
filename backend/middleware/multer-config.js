/*J'importe multer */
const multer = require('multer');

/*Je crée une constante 'dictionnaire' contenant un objet avec les mime_types
autorisés */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/*Je crée une constante 'storage' qui contient la logique nécessaire pour indiquer
à multer où enregistrer les fichiers entrants, la fonction 'destination'
indique à multer d'enregistrer les fichiers dans le dossier images
la fonction 'filename' lui indique d'utiliser le nom d'origine, de remplacer
les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom 
de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour
résoudre l'extension de fichier appropriés. */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/*J'exporte l'élément multer configuré en lui indiquant que seuls les fichiers
images seront gérés avec la méthode 'single'*/
module.exports = multer({storage: storage}).single('image');