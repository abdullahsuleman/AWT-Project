const Express = require('express');
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./connection");
const products = require("./routes/products");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const register = require("./routes/register");
const login = require("./routes/login");
const auth = require("./middleware/auth");

const app = Express();

app.use('/cssFiles',Express.static(__dirname + '/assets/cssFiles'));
app.use('/jsFiles',Express.static(__dirname + '/assets/jsFiles'));

app.use(Express.json());
app.use(cors());
app.use(cookieParser())

app.use('/stock',auth,products);
app.use('/register',register);
app.use('/login',login);

app.set('views', path.join(__dirname + '/views'));
app.set('view engine','ejs');


app.get('/home', auth, (req, res)=>{
    res.render('Home/home');
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});