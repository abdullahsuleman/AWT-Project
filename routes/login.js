const config = require('config');
const db = require("../connection");
const Express = require('express');
const joi = require('joi');
const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const route = Express.Router();
const query = util.promisify(db.query).bind(db);

route.get('/',(req,res)=>{
    res.render('Login/login',{redirectLink:global.redirectLink}); 
});

route.post('/', async (req,res)=>{
    
    try {
        let user = await query("select * from user where username = ?",req.body.username);
        if(user.length < 1) return res.status(400).send("Wrong username or password");

        var validPassword = await bcrypt.compare(req.body.password, user[0].password);
        if(!validPassword){
            return res.status(400).send("Wrong username or password");
        }

        const token = jwt.sign({username:user[0].username},config.get('secretKey.jwtPrivateKey'));
        
        res.send(token);

    } catch (err) {
        console.log(err);
        res.status(400).send("Error in Login. Please try again later");
    }
});

module.exports = route;