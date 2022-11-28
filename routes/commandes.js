var express = require('express');
var router = express.Router();


var db=require('../models');

router.post('/add',(req,res)=>{
    const commandItems = JSON.parse(JSON.stringify(req.body.commandeItems));
    console.log("command items", commandItems)
    let totalPrice = 0
    let promises = []
    const getMenuData = (commandItemId) => {
        console.log("command id", commandItemId)
        return db.CommandeItem.findOne({where:{id:commandItemId}}).then((respCommandItem)=>{
          if(respCommandItem) {
            console.log("commandItemResponse", respCommandItem)
            const quantity = respCommandItem.dataValues.quantity
            console.log("quantity", quantity)
            return db.Menus.findOne({where:{id:respCommandItem.dataValues.menuId}}).then((respMenu)=> {
              return new Promise(function(resolve, reject) {
                resolve({...respMenu.dataValues, "quantity": quantity})
              })
            })
          }
    });
    }
    const getAllMenuPromises = () => {
      promisePrice = commandItems.map(element => {
        const menuDataPromise = getMenuData(element)
        promises.push(menuDataPromise)
  
      });
    }
    let myPromise = new Promise(function(resolve, reject) {
      getAllMenuPromises()
      Promise.all(promises).then((respMenu) => {
        console.log("reee menu", respMenu)
        respMenu.forEach(m => {
          const finalPP = m.price * m.quantity
          console.log("ress price", finalPP)
          totalPrice = totalPrice + finalPP
        })
        resolve(totalPrice)
      })
    })

  myPromise.then((ress)=> {
      console.log("promisee final", ress)
      db.Commande.create({total_price:ress, userId: req.body.userId}).then((p) => {
            commandItems.forEach(element => {
              db.CommandeItem.update({"commandeId": p.dataValues.id},{where:{id:element}}).then(
                ()=>{
                  console.log("succefully added command")
                }
              )
            })
            db.Utilisateurs.findOne({where:{id:req.body.userId}}).then((user) => {
              if(user) {
                const soldeUser = user.solde
                console.log("solde user", soldeUser)
                console.log("9adhia", ress)
                if(soldeUser >= ress) {
                  const updatedSolde = soldeUser - ress
                  db.Utilisateurs.update({"solde": updatedSolde},{where:{id:req.body.userId}}).then(
                    ()=>{
                      console.log("succefully updated user solde")
                    }
                  )
    
                } else {
                  console.log("solde insuffuisant")
                  //res.status(404);
                  //res.json('solde insuffisant');
                  //res.end();
                  //return;
                }
      
              } else {
                console.log("user not found")

                
              }
            })
            return res.status(200).json(p);
        });
    })
  })

router.get('/fetch', function(req, res, next) {
  db.Commande.findAll({
          }).then((resp)=>{
    res.send(resp)
  })
});
router.delete('/remove/:id',(req,res)=>{
db.Commande.destroy({where:{id:req.params.id}}).then(
  ()=>{
    res.send('removed')
  }
)
})
router.put('/update/:id',(req,res)=>{
  db.Commande.update(req.body,{where:{id:req.params.id}}).then(
    ()=>{
      res.send('updated')
    }
  )
  })
router.get('/detail/:id', function(req, res, next) {
  db.Commande.findOne({where:{id:req.params.id}}).then((resp)=>{
    res.send(resp)
  })
});

module.exports = router;
