const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
require('dotenv').config();
const JWT_SECRET = 'sceretKeyUsedforAuthencticationInotebook'
//create a user using: post 'api/auth/create-user' deosn't require auth
router.post('/create-user',[
    body('name','eneter a valid name min:3').isLength({ min: 3 }),
    body('email','enter a valid email example@email.com').isEmail(),
    body('password','enter avalid password min:5').isLength({ min: 5 }),
], async(req , res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let ExistUser = await User.find({ email: req.body.email })
      if(ExistUser.length != 0){
        return res.status(400).json({ errors: 'sorry user already exist with this email' });
      }
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password , salt, function(err, hash) {
             const user =  User.create({
                  name: req.body.name,
                  email: req.body.email,
                  password: hash
                  });
  
              const data = {
                "user" : user.id
              }
  
              const authToken = jwt.sign(data , JWT_SECRET);
  
              res.json({authToken})
  
          });
      });
    } catch (error) {
      return res.status(500).json({ errors: 'internal server error occured' });
      
    }


})


//login a user using: post 'api/auth/login-user' deosn't require auth
router.post('/login-user',[
  body('email','enter a valid email').isEmail(),
  body('password','password cannot be blanl').exists(),
], async(req , res)=>{

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var email = req.body.email;
    var password = req.body.password;
    var user = await User.findOne({email})
  
    if(!user){
      return res.status(400).json({ errors: 'please enter a valid mail or password' });
    }
  
    var crctPass =  await bcrypt.compare(password , user.password);
  
    if(!crctPass){
      return res.status(400).json({ errors: 'please enter a valid mail or password' });
    }
  
    const data = {
      "user" : user.id
    }
  
    const authToken = jwt.sign(data , JWT_SECRET);
  
    res.json({authToken})
    
  } catch (error) {
    return res.status(500).json({ errors: 'internal server error occured' });
  }

});

//get user a user using: post 'api/auth/get-user' deosn't require auth
router.post('/get-user',fetchuser , async(req , res)=>{
  try {
    userId = req.user;
    const userData = await User.findById(userId).select('-password');
    res.json(userData);
  } catch (error) {
    return res.status(500).json({ errors: 'internal server error occured' });
  }

    
});
module.exports = router