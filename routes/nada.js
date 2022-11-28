var express = require('express');
var router = express.Router();

var db=require('../models');
router.get('/', function(req, res, next) {
   
    res.send('removed')
     // res.render("showEvent.twig", {data})
    
});



  router.get('/fetch', function(req, res, next) {
   db.Nadas.findAll().then((resp)=>{
     res.send(resp)
    })
  });

  
    
          module.exports = router;       