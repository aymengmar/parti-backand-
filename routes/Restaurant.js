var express = require('express');
var router = express.Router();


var db=require('../models');


router.post('/add',(req,res)=>{
  db.Restaurants.create(req.body).then(
    (r)=>{
      res.send(r)
    }
  ).catch((e)=>{res.send(e)})
})

router.get('/', function(req, res, next) {
  db.Restaurants.findAll().then((resp)=>{
    res.send(resp)
  })
});
 
router.delete('/remove/:id',(req,res)=>{
db.Restaurants.destroy({where:{id:req.params.id}}).then(
  ()=>{
    res.send('removed')
  }
)
})
router.put('/update/:id',(req,res)=>{
  db.Restaurants.update(req.body,{where:{id:req.params.id}}).then(
    ()=>{
      res.send('updated')
    }
  )
  })
router.get('/detail/:id', function(req, res, next) {
  db.Restaurants.findOne({where:{id:req.params.id}}).then((resp)=>{
    res.send(resp)
  })
});

router.get('/fetchBynom/:nom', function (req, res, next) {
  db.Restaurants.findAll({ where: { first_name: req.params.nom } }).then((resp) => {
    res.send(resp)
  })
});

router.get('/fetchByadd/:add', function (req, res, next) {
  db.Restaurants.findAll({ where: { adress: req.params.nom } }).then((resp) => {
    res.send(resp)
  })
});

module.exports = router;
