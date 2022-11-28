var express = require('express');
var router = express.Router();

var db=require('../models');
router.get('/', function(req, res, next) {
   
    res.send('removed')
     // res.render("showEvent.twig", {data})
    
});

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

  router.delete('/remove/:id',(req,res)=>{
    db.Reclamations.destroy({where:{id:req.params.id}}).then(
      ()=>{
        res.send('removed')
      }
    )
    })

    router.put('/update/:id',(req,res)=>{
        db.Reclamations.update(req.body,{where:{id:req.params.id}}).then(
          ()=>{
            res.send('updated')
          }
        )
        })

        router.get('/detail/:id', function(req, res, next) {
            db.Reclamations.findOne({where:{id:req.params.id}}).then((resp)=>{
              res.send(resp)
            })
          });

          
          module.exports = router;       