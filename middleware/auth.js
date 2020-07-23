const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const token = req.cookies['x-auth-token'];
    if(!token){
        global.redirectLink = req.protocol + '://' + req.get('host') + req.originalUrl;
        return res.redirect('/login');
    }
    try{
        const decoded = jwt.verify(token,config.get('secretKey.jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch(err){
        res.status(400).send("Invalid token");
    }
}