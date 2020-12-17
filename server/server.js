const config = require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


//middleware
app.use(bodyParser.urlencoded({ extended: false }))




const mongooseSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: true
}

mongoose.connect(process.env.URLDB,mongooseSettings,(err,res)=>{
    if(err) throw err;

    console.log('Base de datos online')
});

app.use(require('./routes/usuario'));

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando en el puerto', process.env.PORT);
})