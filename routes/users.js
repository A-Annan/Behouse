var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var user = require('../Model/User');
var jwt = require('jsonwebtoken');
var check_auth = require('../check_auth');




/* GET users listing. */
router.post('/signup', (req, res, next)  => {

  bcrypt.hash(req.body.password,10,(err,hash) => {
      if (err) res.json({err: err});
      else {
        user.create({email: req.body.email, password: hash}).then((user)=>{
          res.json({user: user})
        }).catch(err => {
          res.json({err:err});
        })
      }
  })
});

router.post('/login', (req,res, next)=> {
    console.log(req.body.user)
    user.findOne({where:{email: req.body.user.email}})
        .then(user => {
            bcrypt.compare(req.body.user.password,user.password,(err,result) => {
                if (err) res.json({err:err});
                if (result) {
                  var token = jwt.sign(
                        {
                            email: user.email,
                            id: user.id
                        },
                        'annan',
                        {
                            expiresIn: "672h"
                        }
                    );
                    res.json({
                        success: true,
                        token:token,
                        email: req.body.user.email
                    });
                }
                else {
                    res.json({
                        success: false,
                        msg:'password not correct'
                    });
                }

            })
        })
        .catch(err => {
            res.json({msg: 'mail not found'});
        })
})


router.get('/islogin',check_auth,(req,res,next) => {
    res.json({success: true});
})

module.exports = router;
