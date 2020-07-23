const express = require('express');
const Joi = require('joi');
const db = require("../connection");
const _ = require('lodash');
const util = require('util');

const route = express.Router();

route.get('/',(req,res)=>{
    db.query("SELECT * FROM PRODUCT", (error,result) => {
        if (error){
            console.log("error in query" + error.stack);
            return res.status(404).send("Resource not found");
        }
        res.render('Products/index',{products:result});
    });
});

route.post('/',(req,res)=>{
    var {error , value} = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    db.query('INSERT INTO product SET ?' ,req.body ,(error,result)=>{
        if(error){
            //console.log("Error while adding new product", error.stack);
            console.log(error.code);
            console.log(error.sqlMessage);
            return res.status(400).send(String(error.errno));
        }
        /*
        console.log(result.insertId);
        db.query('SELECT * FROM PRODUCT WHERE PID = ?',result.insertId,(error,result)=>{
            if (error) return res.status(400).send("Please reload the page to see changes");
            console.log("Sucessfuly added new product");
            res.send(result[0]);
        });*/
        req.body.pid = result.insertId;
        res.send(req.body);
    });
});

route.delete('/:id',(req,res)=>{
    db.query('DELETE from product where pid = ?',req.params.id,(error,result)=>{
        if(error){
            console.log("error in query" + error.stack);
            return res.status(400).send("Can't delete the Product");
        }
        console.log('deleted ' + result.affectedRows + ' rows');
        return res.status(200).send("Record deleted successfully");
    });
});

// Updating Product
route.put('/',(req,res)=>{

    //Validating the request
    var data = _.pick(req.body,['name','description','price']);
    var {error , value} = validateProduct(data);
    if (error) return res.status(400).send(error.details[0].message);

    // Updating Product table
    let sql = `UPDATE product SET ? WHERE pid = ?`;
    db.query(sql,[data,req.body.pid],(error,result) => {
        if (error){
            console.log(error.sqlMessage);
            return res.status(400).send(String(error.errno));
        } 
        console.log(result.insertId);
        // Getting the updated Row from Database
        db.query('SELECT * FROM PRODUCT WHERE PID = ?',req.body.pid,(error,result)=>{
            if (error) return res.status(400).send("Please reload the page to see changes");
            console.log("Sucessfully added new product");
            res.send(result[0]);
        });
    });
});

// Adding Stock
route.put('/:id',(req,res)=>{
    //Validating the request
    var {error , value} = validateStock(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Updating row in Database
    let sql = `UPDATE product SET ? WHERE pid = ?`;
    db.query(sql,[req.body,req.params.id],(error,result) => {
        if (error){
            console.log(error.sqlMessage);
            return res.status(400).send(String(error.errno));
        }
        // Getting the updated Row from Database
        db.query('SELECT * FROM PRODUCT WHERE PID = ?',req.params.id,(error,result)=>{
            if (error) return res.status(400).send("Please reload the page to see changes");
            console.log("Sucessfully added new product");
            res.send(result[0]);
        });
    });
});

function validateStock(data){
    const schema = {
        w1 : Joi.number().max(99999),
        w2 : Joi.number().max(99999),
        w3 : Joi.number().max(99999),
        w4 : Joi.number().max(99999)
    }
    return Joi.validate(data,schema);
}

function validateProduct(data){
    const schema = {
        name : Joi.string().max(30).required(),
        description : Joi.string().max(30).allow(''),
        price : Joi.number().max(99999).required()
    }
    return Joi.validate(data,schema);
}

module.exports = route;