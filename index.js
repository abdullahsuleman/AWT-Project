const Express = require('express');

const app = Express();

app.get('/', (req, res)=>{
    res.send('hello Shahraiz');
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});