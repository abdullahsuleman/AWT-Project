const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const Joi = require('joi');
const db = require("../connection");
const _ = require("lodash")
const bcrypt = require('bcrypt');

const route = express.Router();

route.get('/',(req,res)=>{
    res.render('Register/register',{redirectLink:global.redirectLink}); 
});

route.post('/',(req,res)=>{

    var {error, value} = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    db.query("Select * from user where username = ?",value.username, async (error,result)=>{
        if(error){throw error}
        if(result.length>0) return res.status(409).send("User already exist");

        var user = _.pick(value,['username','password'])

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        
        db.query("INSERT INTO USER SET ?",user,(error,result)=>{
            if (error) console.log("can not register new user " + error.code);

            const token = jwt.sign({username:value.username},config.get('secretKey.jwtPrivateKey'));
            res.send(token);
        });
    });
});

function validateUser(data){
    const schema = {
        username : Joi.string().min(5).max(18).required(),
        password: Joi.string().min(3).max(15).required(),
        password_confirmation: Joi.any().valid(Joi.ref('password'))
            .required()
            .options({ language: { any: { allowOnly: 'must match password' } } })
    }
    return Joi.validate(data,schema);
}

module.exports = route;