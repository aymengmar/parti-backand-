asyncLib.waterfall([
    function(done) {
      db.Utilisateurs.findOne({
        attributes: ['id', 'email'],
        where: { id: userId }
      }).then(function (userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if(userFound) {
      //  db.Utilisateurs.update(req.body,{where:{id:req.params.id}})
      //  userFound.update({
       //   email: (email ? email : userFound.email)
       // })
      // .then(function() {
      //    done(userFound);
       // }).catch(function(err) {
       //   res.status(500).json({ 'error': 'cannot update user' });
       // });
       res.json(userFound);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(userFound) {
    if (userFound) {
      return res.status(201).json(userFound);
    } else {
      return res.status(500).json({ 'error': 'cannot update user profile' });
    }
  });



  router.get('/updateUserProfil/:id',function(req, res, next){
    //Getting auth header
    //var headerAuth  = req.headers['authorization'];
    //var userId      = jwtUtils.getUserId(headerAuth);
    
    db.Utilisateurs.findOne({where:{id:req.params.id}}).then((resp)=>{
      res.send(resp)
    })
     });
    
      router.get('/detailkk/:id', function(req, res, next) {
        db.Utilisateurs.findOne({where:{id:req.params.id}}).then((resp)=>{
          res.send(resp)
        })
      });