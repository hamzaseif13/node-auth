const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const routes = require('./routes/auth');
const secureRoute = require('./routes/profile');
const cors = require('cors')
const app = express();
const path = require('path')
const config =require('./config')
require('./auth/auth');
const PORT = process.env.PORT || 5050
async function start(){
  try{
    await mongoose.connect(config.mongoURL)
    console.log("db connected");
    app.listen(PORT,()=>console.log("server listineng on "+PORT))
  }catch(error){
      console.error(error)
  }
}

start();


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static(path.join(__dirname, '../front-end/dist')));

// login and register
app.use('/api', routes);
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/api/user', passport.authenticate('jwt', { session: false }), secureRoute);

// serve the front-end
if(process.env.NODE_ENV==="production"){
  app.get("/*",(req,res)=>{
    res.sendFile(path.join(__dirname+'/../front-end/dist/index.html'))
  })
}

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

