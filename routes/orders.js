const express = require('express');
const bodyParser = require("body-parser");
const Joi = require('joi');
const db = require("../connection");
const _ = require('lodash');
const util = require('util');

const route = express.Router();
route.use(bodyParser.json());

route.get('/',(req,res)=>{
    db.query("SELECT * FROM customer", (error,result) => {
        if (error){
            console.log("error in query" + error.stack);
            return res.status(404).send("Resource not found");
        }
        res.render('Orders/index',{customers:result});
    });
});

route.post('/',(req,res)=>{

    //var {error , value} = validateOrder(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

    //Calculating the total price of entire cart
    var total = 0
    for (t of req.body) {
        total += Number(t.total);
    }
    // SQL queries for mass insertion 
    let sql0 = "INSERT INTO `orders` ( `cust_id`, `balance`, `total`, `date`) VALUES ?";
    let sql1 = "INSERT INTO `purchases`(`product_id`, `order_id`, `quantity`) VALUES ?";
    
    let todos = req.body
    var orderInsertion=[]; 
    var purchasesInsertion =[];
    //  var order_id; - not using 
    for (o of todos) { orderInsertion = [[o.cid, total, total, '2020/5/25']]; }; // Add new entry to order table
  
    // calling the function
    orderss(sql0,[orderInsertion],function(orderid){ // takes orderid
        purchasesInsertion = []
        for (o of todos) {
            purchasesInsertion.push([o.id, orderid, o.count]);
        };
        db.query(sql1, [purchasesInsertion],(error,result)=>{
        if(error){
            //console.log("Error while adding new purchase", error.stack);
            console.log(error.code);
            console.log(error.sqlMessage);
            return res.status(400).send(String(error.errno));
        }
        });
    });

      // Funtion to add order with a callback - that allows us to add purchase 
    function orderss (query, [array], callback) {
        db.query(query,[array], (error,result)=>{
            if(error){
               // console.log("Error while adding new order", error.stack);
                console.log(error.code);
                console.log(error.sqlMessage);
                return res.status(400).send(String(error.errno));
            }
            callback(result.insertId) // send orderid 
    });
    }


  //  Update the stock value for the relevant product from the selected warehouse

  for (o of todos) {
    var sql3 = "UPDATE product SET "+o.wid+" = "+o.wid+"-"+o.count+" WHERE pid = "+o.id+"";
    db.query(sql3, (error,result)=>{
        if(error){
            //console.log("Error while adding new purchase", error.stack);
            console.log(error.code);
            console.log(error.sqlMessage);
            return res.status(400).send(String(error.errno));
        }


    });
};
    console.log("order post received");
    var response = {
        status  : 200,
        success : 'New added!'
    }
    res.end(JSON.stringify(response));
    //return res.status(200);
    
});

route.get('/:id/new',async (req,res)=>{
    const query = util.promisify(db.query).bind(db);
    let sql2 = "SELECT name FROM customer where cid = ?";
    let sql1 = "SELECT * FROM product";
    var cust_name, products;

    try{
        products = await query(sql1);
    } catch(err){
        console.log(err.stack);
        return res.status(400).send("can't load products");
    }
    try{
        cust_name = await query(sql2,req.params.id);
    } catch(err){
        console.log(err.stack);
        cust_name="";
    }
    res.render('Orders/new',{
        customer_id:req.params.id,
        customer:cust_name[0].name,
        products: products
    });
});


function validateOrder(data){
    const schema = {
        count : Joi.number().max(99999).required(),
        id : Joi.number().max(99999).required(),
        name : Joi.string().max(30).required(),
        price : Joi.string().max(99999).required(),
        total : Joi.number().max(99999).required(),
	    wid : Joi.number().max(99999).required(),
        cid : Joi.number().max(99999).required()
    }
    return Joi.validate(data,schema);
}

module.exports = route;