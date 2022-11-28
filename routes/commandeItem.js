var express = require('express');
var router = express.Router();


var db=require('../models');

router.post('/add',(req,res)=>{
       console.log("menu id", req.body.MenuId)
                    db.CommandeItem.create({
                        quantity: req.body.quantity,
                        menuId:req.body.MenuId 
                    }).then(
                        (p) => {
                            res.send(p);
                        }
                    );
                }
          )

router.get('/fetch', function(req, res, next) {
  db.CommandeItem.findAll().then((resp)=>{
    res.send(resp)
  })
});
router.delete('/remove/:id',(req,res)=>{
db.CommandeItem.destroy({where:{id:req.params.id}}).then(
  ()=>{
    res.send('removed')
  }
)
})
router.put('/update/:id',(req,res)=>{
  db.CommandeItem.update(req.body,{where:{id:req.params.id}}).then(
    ()=>{
      res.send('updated')
    }
  )
  })
router.get('/detail/:id', function(req, res, next) {
  db.CommandeItem.findOne({where:{id:req.params.id}}).then((resp)=>{
    res.send(resp)
  })
});

module.exports = router;
