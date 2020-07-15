const Joi = require('joi');
const db = require("../connection");

const getProducts = function (callback){
    db.query("SELECT * FROM PRODUCT", (err,result) => {
        callback({error : err, result: result});
    });
}

const insertProduct = function (data, callback){
    db.query('INSERT INTO product SET ?' ,data ,(err,result)=>{
        callback({error : err, result:result});
    });
}

const deleteProduct = function (id , callback) {
    db.query('DELETE from product where pid = ?',id,(err,result)=>{
        callback({error : err, result:result});
    });
}

function validateProduct(data){
    const schema = {
        name : Joi.string().max(30).required(),
        folio : Joi.number().max(99999),
        price : Joi.number().max(99999).required(),
        quantity : Joi.number().max(99999).required()
    }
    return Joi.validate(data,schema);
}


module.exports.get = getProducts;
module.exports.delete = deleteProduct;
module.exports.validate = validateProduct;
module.exports.insert = insertProduct;