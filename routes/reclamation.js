var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
var db=require('../models');
const JWT_SIGN_SECRET = '<JWT_SIGN_TOKEN>';
var nodemailer = require('nodemailer');
router.get('/', function(req, res, next) {
   
    res.send('removed')
     // res.render("showEvent.twig", {data})
    
});


var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'chebbi.nada@esprit.tn',
    pass: 'E09914057'
  }
});


var mailOptions = {
  from: 'nadt22225@gmail.com',
  to: 'nadt22225@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};


  router.get('/mail',(req,res)=>{
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  })

router.post('/add',(req,res)=>{
    db.Reclamations.create(req.body).then(
      (r)=>{
        res.send(r)
      }
    ).catch((e)=>{res.send(e)})
  })

  router.get('/fetch', function(req, res, next) {
    db.Reclamations.findAll().then((resp)=>{
      res.send(resp)
    })
  });
  router.get('/fetchRecUser/:id',authenticateToken, function(req, res, next) {
    db.Reclamations.findAll({where:{UtilisateurId:req.params.id}}).then((resp)=>{
      res.send(resp)
    })
  });
  router.get('/fetchRec/:id', function(req, res, next) {
   var id = req.body.id 
    db.Reclamations.findOne({where:{id:req.params.id}}, include [{model:db.Utilisateurs, where:{id:req.body.id}}]).then((resp)=>{
      res.send(resp)
    })
    
  });
  router.get('/fetchRecby/:id', function(req, res, next) {
    var id = req.body.id 
     db.Reclamations.findOne({where:{id:req.params.id}}).then((resp)=>{
      res.send(resp)
    })
  });
  router.get('/count', function(req, res, next) {
     db.Reclamations.findAndCountAll({where:{etat:"NonTraiter"}}).then(
      (count)=>{
        res.send(count)
      }
     )

  });

  router.get('/count/:id',authenticateToken, function(req, res, next) {
    db.Reclamations.findAndCountAll({where:{UtilisateurId:req.params.id , etat:"NonTraiter"}}).then(
     (count)=>{
       res.send(count)
     }
    )

 });

  router.delete('/remove/:id',(req,res)=>{
    db.Reclamations.destroy({where:{id:req.params.id}}).then(
      ()=>{
        res.send('removed')
      }
    )
    })

    router.put('/update/:id',authenticateToken,(req,res)=>{
        db.Reclamations.update(req.body,{where:{id:req.params.id}}).then(
          ()=>{
            res.send('updated')
          }
        )
        })

        router.put('/updateEtat/:id',authenticateToken,(req,res)=>{
          req.body.etat =" Traiter";
          db.Reclamations.update(req.body,{where:{id:req.params.id}}).then(
            ()=>{
              res.send('updated')
            }
          )
          })

        router.get('/detail/:id',authenticateToken, function(req, res, next) {
            db.Reclamations.findOne({where:{id:req.params.id}}).then((resp)=>{
              res.send(resp)
            })
          });

          function authenticateToken(req, res, next) {
            const authHeader = req.headers['authorization']; //Bearer TOKEN
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.status(401).json({error:"Null token"});
            jwt.verify(token,JWT_SIGN_SECRET, (error, user) => {
              if (error) return res.status(403).json({error : error.message});
              req.user = user;
              next();
            });
          }
          module.exports = router;       