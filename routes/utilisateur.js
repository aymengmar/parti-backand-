var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var etatU;
var db = require('../models');
//sms
const twilio = require('twilio');
require('dotenv').config();
const JWT_SIGN_SECRET = '<JWT_SIGN_TOKEN>';
const accountSid = "AC802a63185d59b964470833562cfa2435"; 
const authToken = "844f09591f7cd2da6dcfc4ca7f7f53d0";  
//MAIL
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      
    user: 'chebbi.nada@esprit.tn',
    pass: 'E09914057'
  }
});
//Imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
const { resolveContent } = require('nodemailer/lib/shared');
//token

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
router.get('/', authenticateToken,function (req, res, next) {

  db.Utilisateurs.findAll().then((data) => {
   // res.send(data.length)

   for (let i = 0; i <data.length ; i++) {
   // console.log(data[i].nom); 
   //DateTime.now().withTimeAtStartOfDay()
   var id = data[i].id;
   var datetime = new Date();
   var d = datetime.toLocaleDateString() ;
   //var dateBol = data[i].DateDesactivation;
   //var diff = datetime - dateBol;
   var dateBlock = data[i].DateDesactivation;
   var email = data[i].email;
   var statutToT = data[i].statut;
   var NomToT = data[i].nom;
   var yT = 5 - (data[i].NbrDesactivation);
   var Diff_temps = datetime.getTime() - dateBlock.getTime(); 
   var Diff_jours = Diff_temps / (1000 * 3600 * 24); 
   //console.log(Diff_jours); 
   console.log(Math.round(Diff_jours)); 
   //console.log(datetime.getTime());
   var nb_jour = Math.round(Diff_jours);
   if(nb_jour>=15 && data[i].etat=="inactif"){
    req.body.etat='actif';
    req.body.DateActivation=datetime;
    db.Utilisateurs.update(req.body, { where: { id: id } }).then(
      () => {
        console.log('updated')
        
        var mailOptions = {
          from: 'chebbi.nada@esprit.tn',
          to: email,
          subject: 'Activation du compte Tasta ',
          text:'Bonjour '+data[i].statut+'  '+data[i].nom+' votre compte Tasta a été ativé le '+d + 'il vous reste que ' + yT +" fois sinon votre compte sera supprimé",

        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    )
   }
   if(data[i].NbCommande>=40){
    /*  if(data[i].statut=="client"){
        const client = new twilio(accountSid, authToken);

client.messages.create({


    body:"Cher client "+data[i].nom+" votre application Tasta vous remercie de votre fidélité, vous avez atteindre  "+ data[i].NbCommande+" ,Vous profitez alors de 10% de remise en caisse sur présentation de ce SMS"
    ,
    to: '+21627685563', 
    from: '+12058276690' 
})
.then((message) => console.log(message.sid));


      }
      else if (data[i].statut=="restaurateur"){


        const client = new twilio(accountSid, authToken);

client.messages.create({
    body:"Cher restorateur "+data[i].nom+" votre application Tasta vous remercie de votre fidélité, vous avez atteindre "+data[i].NbCommande+" ,Vous profitez alors d'une publicité gratuite cette semaine. " ,
    to: '+21627685563', 
    from: '+12058276690' 
})
.then((message) => console.log(message.sid));



      }
      */
        req.body.NbCommande = data[i].NbCommande-40;
      db.Utilisateurs.update(req.body, { where: { id: data[i].id } }).then(
        () => {
          res.send('updated')
        }
      )


   }

  }

  })

});

// jwt
router.post('/register', (req, res) => {
  var email = req.body.email;
  var nom = req.body.nom;
  var password_ = req.body.password_;
  var code = req.body.code;
  var Login = req.body.Login;
  var prenom = req.body.prenom;
  var region = req.body.region;
  var rue = req.body.rue;
  var telephone = req.body.telephone;
  var ville = req.body.ville;
  var statut = req.body.statut;
  var role = req.body.role;
  if (email == null || nom == null || password_ == null || code == null || Login == null || prenom == null || region == null || rue == null || telephone == null || ville == null || role==null ) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  if (Login.length >= 13 || Login.length <= 4) {
    return res.status(400).json({ 'error': 'wrong Login (must be length 5 - 12)' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ 'error': 'email is not valid' });
  }

  if (!PASSWORD_REGEX.test(password_)) {
    return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
  }

  asyncLib.waterfall([
    function (done) {
      db.Utilisateurs.findOne({
        attributes: ['Login'],
        where: { Login: Login }
      })
        .then(function (userFound) {
          done(null, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
    },
    function (userFound, done) {
      if (!userFound) {
        bcrypt.hash(password_, 5, function (err, bcryptedPassword) {
          done(null, userFound, bcryptedPassword);
        });
      } else {
        return res.status(409).json({ 'error': 'user already exist' });
      }
    },
    function (userFound, bcryptedPassword, done) {
      var newUser = db.Utilisateurs.create({
        email: email,
        nom: nom,
        password_: bcryptedPassword,
        code: code,
        Login: Login,
        prenom: prenom,
        region: region,
        rue: rue,
        telephone: telephone,
        statut : statut,
        ville: ville,
        /* role: role, */

      })
        .then(function (newUser) {
          done(newUser);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'cannot add user' });
        });
    }
  ], function (newUser) {
    if (newUser) {
      return res.status(201).json({
        'id': newUser.id
      });
    } else {
      return res.status(500).json({ 'error': 'cannot add user' });
    }
  });
})

//authentification 

router.post('/login', (req, res) => {
  // Params
  var Login = req.body.Login;
  var password_ = req.body.password_;

  if (Login == null || password_ == null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  asyncLib.waterfall([
    function (done) {
      db.Utilisateurs.findOne({
        where: { Login: Login }
      })
        .then(function (userFound) {
          done(null, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
    },
    function (userFound, done) {
      if (userFound) {
        if(userFound.etat=='actif'){
          bcrypt.compare(password_, userFound.password_, function (errBycrypt, resBycrypt){
            done(null, userFound, resBycrypt);
          
          // .then((same)=> {
            /* if (same ){
              let token =jwt.sign({
                id:userFound.id,
                role:userFound.role,
                Login:userFound.Login,
              }) */
              
            })
          }
          
        
        else {
          return res.status(404).json({ 'error': 'utilisateur bloqué ' });
        }
        
       
      } else {
        return res.status(404).json({ 'error': 'user not exist in DB' });
      }
    },
    function (userFound, resBycrypt, done) {
      if (resBycrypt) {
        done(userFound);
      } else {
        return res.status(403).json({ 'error': 'invalid password' });
      }
    }
  ], function (userFound) {
    if (userFound) {
      return res.status(201).json({
         'id': userFound.id, 
        'token': jwtUtils.generateTokenForUser(userFound),
        'role' : userFound.role
      });
    } else {
      return res.status(500).json({ 'error': 'cannot log on user' });
    }
  });


})









router.post('/add', (req, res) => {
 
  db.Utilisateurs.create(req.body).then(
    (r) => {
      res.send(r)
    }
  ).catch((e) => { res.send(e) })

})




router.get('/detailUser/:id',authenticateToken, function (req, res, next) {
  db.Utilisateurs.findOne({ attributes: ['email', 'region'], where: { id: req.params.id } }).then((resp) => {
    res.send(resp)
  })
});
router.get('/fetchById/:id',authenticateToken, function (req, res, next) {
  db.Utilisateurs.findOne({ attributes: ['Login', 'etat'], where: { id: req.params.id } }).then((resp) => {
    res.send(resp)
  })
});
router.get('/fetchByLogin/:Login', function (req, res, next) {
  db.Utilisateurs.findOne({ where: { Login: req.params.Login } }).then((resp) => {
    res.send(resp)
  })
});
router.get('/fetchEtat/:id',authenticateToken, function (req, res, next) {
  db.Utilisateurs.findOne({ attributes: ['etat'], where: { id: req.params.id } }).then((resp) => {
    etatU = resp.etat;
    res.send(etatU);
  })
});
router.get('/fetchByStatus/:statut',authenticateToken, function (req, res, next) {
  db.Utilisateurs.findAll({ where: { statut: req.params.statut } }).then((resp) => {
    res.send(resp)
  })
});
router.get('/fetchByCart/:Cart', function (req, res, next) {
  db.Utilisateurs.findAll({
    where: {
      [Op.or]: [
        { Login: req.params.Cart },
        { nom: req.params.Cart },
        { prenom: req.params.Cart }
      ]
    }
  }).then((resp) => {
    res.send(resp)
  })
});
router.get('/fetch',authenticateToken, function (req, res, next) {
  db.Utilisateurs.findAll().then((resp) => {
    res.send(resp)
  })
});

router.delete('/remove/:id',authenticateToken, (req, res) => {
  db.Utilisateurs.destroy({ where: { id: req.params.id } }).then(
    () => {
      res.send('removed')
    }
  )
})
router.delete('/removeInactif',authenticateToken, (req, res) => {
  db.Utilisateurs.destroy({ where: { NbrDesactivation: { [Op.gte]: 5 } } }).then(
    () => {
      res.send('removed')
    }
  )
})


router.put('/update/:id', (req, res) => {
  db.Utilisateurs.update(req.body, { where: { id: req.params.id } }).then(
    () => {
      res.send('updated')
    }
  )
})

router.put('/updatePsw',authenticateToken, (req, res) => {
  var Login = req.body.Login;
  var password_ = req.body.password_;
  var NewPsw = req.body.NewPsw ;
  if (!PASSWORD_REGEX.test(NewPsw)) {
    return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
  }
  if (Login == null || password_ == null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }
  asyncLib.waterfall([
    function (done) {
      db.Utilisateurs.findOne({
        where: { Login: Login }
      })
        .then(function (userFound) {
          done(null, userFound);
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
    },
    function (userFound, done) {
      if (userFound) {
        bcrypt.compare(password_, userFound.password_, function (errBycrypt, resBycrypt) {
          done(null, userFound, resBycrypt);
        });
      } else {
        return res.status(404).json({ 'error': 'user not exist in DB' });
      }
    },
    function (userFound, resBycrypt, done) {
      if (resBycrypt) {
        done(userFound);
      } else {
        return res.status(403).json({ 'error': 'invalid password' });
      }
    },
    
    function (userFound, done) {
      if (userFound) {
        bcrypt.hash(NewPsw, 5, function (err, bcryptedPassword) {
          done(null, userFound, bcryptedPassword);
        });
      } else {
        return res.status(409).json({ 'error': 'user already exist' });
      }
    },
    function (userFound, bcryptedPassword, done) {
      req.body.password_ = bcryptedPassword ;
      

      db.Utilisateurs.update(req.body, { where: { Login: Login} }).then(
        () => {
          res.send(req.body.password_)
        }
      )
     
       
    }
  ],
);
})
router.get('/fetchById/:id', authenticateToken,function (req, res, next) {
  db.Utilisateurs.findOne({ attributes: ['Login', 'etat'], where: { id: req.params.id } }).then((resp) => {
    res.send(resp)
  })
});
router.delete('/removeInactif',authenticateToken, (req, res) => {
  db.Utilisateurs.destroy({ where: { NbrDesactivation: { [Op.gte]: 5 } } }).then(
    () => {
      res.send('removed')
    }
  )
})

router.get('/fetchEtat/:id',authenticateToken, function (req, res, next) {
  db.Utilisateurs.findOne({ attributes: ['etat'], where: { id: req.params.id } }).then((resp) => {
    etatU = resp.etat;
    res.send(etatU);
  })
});

router.put('/updateEtat/:id', (req, res) => {
  console.log("nadaaaaaaaaaaaaaaaa"+req.params.etat)
  db.Utilisateurs.findOne({ attributes: ['etat','statut','nom','email', 'NbrDesactivation', 'DateDesactivation', 'DateActivation'], where: { id: req.params.id } }).then((resp) => {
    statutTo=resp.statut;
    NomTo=resp.nom;
    etatU = resp.etat;
    emailTO=resp.email;
   
    var NowEtat = req.params.etat;
    console.log("nadaaaaaaaaaaaaaaaa"+NowEtat+etatU)
    var y = 5 - (resp.NbrDesactivation);
    var x = y -1;
    if (etatU == "actif" && NowEtat == "actif") {
      res.send('actif actif')
      console.log('actif actif')
    }
    else if (etatU == "inactif" && NowEtat == "actif") {
      //res.send('actif inactif')
      console.log('inactif actif')
      var datetime = new Date();
      var d = datetime.toLocaleDateString() ;
      req.body.DateActivation = datetime;
      db.Utilisateurs.update(req.body, { where: { id: req.params.id } }).then(
        () => {
          res.send('updated inactif actif' + d)
          var mailOptions = {
            from: 'chebbi.nada@esprit.tn',
            to: emailTO,
            subject: 'Activation du compte Tasta ',
            text:'Bonjour '+statutTo+'  '+NomTo+' votre compte Tasta a été activé le '+d + ' , il vous reste que ' + y +" fois sinon votre compte sera supprimé .",

          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        } 
       
      )

    }
    else if (etatU == "inactif" && NowEtat == "inactif") {
      res.send('inactif inactif')
      console.log('inactif inactif')
    }

    else if (etatU == "actif" && NowEtat == "inactif") {
      var datetime = new Date();
      var d = datetime.toLocaleDateString() ;
      console.log('actif inactif')
      req.body.DateDesactivation = datetime;
      var nb = resp.NbrDesactivation;
      var x = nb + 1;
      var  z = 5-x; 
      req.body.NbrDesactivation = x;
    if(nb>=5){
      db.Utilisateurs.destroy({ where: { id: req.params.id }  }).then(
        () => {
          res.send('removed');
          var mailOptions = {
            from: 'chebbi.nada@esprit.tn',
            to: emailTO,
            subject: 'Suppression du compte Tasta ',
            text:'Bonjour '+statutTo+'  '+NomTo+' votre compte Tasta a été supprimé le '+d ,

          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
             
            }
         
          });

        }
      )
    }
    else{
//var tomorrow = new Date();
var tomorrow = new Date();
//var dt = datetime.toLocaleDateString() ;
tomorrow.setDate(datetime.getDate()+15);
var dt = tomorrow.toLocaleDateString() ;
      db.Utilisateurs.update(req.body, { where: { id: req.params.id } }).then(
        () => {
          res.send('updated  actif inactif : nbDesativation  ' + x + ' Date ' + d)
          var mailOptions = {
            from: 'chebbi.nada@esprit.tn',
            to: emailTO,
            subject: 'Blocage  du compte Tasta ',
            text:'Bonjour '+statutTo+'  '+NomTo+' votre compte Tasta a été bloqué le '+d + ' , il  sera activé le '+ dt+', et il vous reste que ' + z +" fois sinon votre compte sera supprimé",

          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
             
            }
         
          });
         
        }
        
      )
      //  db.Utilisateurs.update({etat:NowEtat , NbrDesactivation:req.params.NbrDesactivation},{where:{id:req.params.id}}).then(
      // ()=>{
      //  var x = req.params.NbrDesactivation
      // x++
      // res.send(x)
      // }
      // )


    }
    // db.Utilisateurs.update(req.body,{where:{id:req.params.id}}).then(
    //  ()=>{
    //  res.send('updated')
  }}
  )
})
router.get('/detail/:id',function (req, res, next) {
  
      db.Utilisateurs.findOne({ where: { id: req.params.id } }).then((resp) => {
        res.send(resp)
      
    
  
  });
 
})

router.put('/pp/:id', function (req, res, next) {
  var headerAuth = req.headers['authorization'];
  var userId = jwtUtils.getUserId(headerAuth);
  var email = req.body.email;
  asyncLib.waterfall([
    function (done) {
      db.Utilisateurs.findOne({
        attributes: ['id', 'email'],
        where: { id: req.params.id }
      }).then(function (userFound) {
        done(null, userFound);
      })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
    },
    function (userFound, done) {
      if (userFound) {
        //db.Utilisateurs.update(req.body,{where:{id:req.params.id}})
        userFound.update({
          email: (email ? email : userFound.email)
        })
          .then(function () {
            done(userFound);
          }).catch(function (err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        res.json(userFound);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function (userFound) {
    if (userFound) {
      return res.status(201).json(userFound);
    } else {
      return res.status(500).json({ 'error': 'cannot update user profile' });
    }
  });
});

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; //Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({error:"Null token"});
  jwt.verify(token,JWT_SIGN_SECRET, (error, user , role) => {
    if (error) return res.status(403).json({error : error.message});
    req.user = user;
    req.role = role ;

    next();
  });
}




module.exports = router;       