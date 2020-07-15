const Express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./connection");
const products = require("./routes/products");
const cors = require("cors");

const app = Express();

app.use('/cssFiles',Express.static(__dirname + '/assets/cssFiles'));
app.use('/jsFiles',Express.static(__dirname + '/assets/jsFiles'));

app.use(Express.json());
app.use(cors());
app.use('/stock',products);

app.set('views', path.join(__dirname + '/views'));
app.set('view engine','ejs');


app.get('/home', (req, res)=>{
    res.render('Home/home');
    // res.render('views/Products/index.html');
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});