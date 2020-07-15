const express = require('express');
const path = require("path");
const product = require('../modules/products');

const route = express.Router();

route.get('/',(req,res)=>{
    product.get(({error, result})=>{
        if (error){
            console.log("error in query" + error.stack);
            return;
        }
        res.render('Products/index',{products:result});
    });
});

route.post('/',(req,res)=>{
    var {error , value} = product.validate(req.body);
    
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    product.insert(req.body,({error,result})=>{
        if(error){
            //console.log("Error while adding new product", error.stack);
            console.log(error.code);
            console.log(error.sqlMessage);
            res.status(400).send(String(error.errno));
            return;
        }
        console.log("Sucessfuly added new product");
        value['pid'] = result.insertId;
        res.send(value);
    });
    //console.log(req.body);
});

route.delete('/:id',(req,res)=>{
    product.delete(req.params.id, ({error,result})=>{
        if(error){
            console.log("error in query" + error.stack);
            return;
        }
        console.log('deleted ' + result.affectedRows + ' rows');
        res.status(200).send("Record deleted successfully");
    });
});

module.exports = route;