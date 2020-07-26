const express = require('express');
const db = require("../connection");
const _ = require("lodash");
const Joi = require('joi');
const util = require('util');

const route = express.Router();

route.get('/createOrder',(req,res)=>{
    db.query("SELECT * FROM customer", (error,result) => {
        if (error){
            console.log("error in query" + error.stack);
            return res.status(404).send("Resource not found");
        }
        res.render('Orders/index',{customers:result});
    });
});

route.post('/createOrder',(req,res)=>{

    //var {error , value} = validateOrder(req.body);
    //if (error) return res.status(400).send(error.details[0].message);

    //Calculating the total price of entire cart
    var total = 0
    for (t of req.body) {
        total += Number(t.total);
    }
    // SQL queries for mass insertion 
    let sql0 = "INSERT INTO `orders` ( `cust_id`, `balance`, `total`) VALUES ?";
    let sql1 = "INSERT INTO `purchases`(`product_id`, `order_id`, `quantity`) VALUES ?";
    
    let todos = req.body;
    var orderInsertion=[]; 
    var purchasesInsertion =[];

    orderInsertion = [[req.body[0].cid, total, total]]; // Add new entry to order table
    // calling the function
    orderss(sql0,[orderInsertion],function(orderid){ // takes orderid
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

route.get('/createOrder/:id/new',async (req,res)=>{
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

route.delete('/:id',(req,res) =>{
    db.query('DELETE from orders where oid = ?',req.params.id,(err,result)=>{
        if(err){
            console.log(err.sqlMessage);
            return res.status(400).send("Can't delete Order");
        }
        console.log('Order deleted');
        console.log('deleted ' + result.affectedRows + ' rows');
        return res.send("Record deleted successfully");
    });
});


route.get('/:oid/invoice',async (req,res)=>{
    const query = util.promisify(db.query).bind(db);
    var sql1 = 'Select purchases.order_id, purchases.quantity, product.name, product.price '+
                ' from purchases join product on purchases.product_id = product.pid where order_id = ?';
    var sql2 = 'Select orders.oid, orders.total, customer.name, orders.date, customer.contact'+ 
                ' from orders join customer on orders.cust_id = customer.cid where oid = ?';
    var purchase,order;
    try{
        purchase = await query(sql1,req.params.oid);
        order = await query(sql2,req.params.oid);
        var date = order[0].date.split(' ')[0].split('-');
        date = new Date(date[0], date[1] - 1, date[2]); 
        order[0].date = date.toDateString();
        return res.render('Invoice/invoice',{
            data:
            {
                products: purchase,
                order: order[0]
            }
        });
    } catch (error){
        res.status(400).send("Can't Fetch the data, Please try again later");
    }
    
});

route.put('/',(req,res)=>{
    var amount = Number(req.body.amount);
    var balance = Number(req.body.balance);
    if((balance-amount)<0) return res.status(400).send("Debit amount must be less than Balance");
    var sql = 'update orders set balance = '+(balance-amount)+' where oid = ?';
    db.query(sql,req.body.oid,(error,result)=>{
        if(error) return res.status(400).send("Can't update Account. Please try again later");
        res.send(String(balance-amount));
    });
});

module.exports = route;