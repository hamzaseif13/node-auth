const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const routes = require('./routes/auth');
const secureRoute = require('./routes/profile');
const cors = require('cors')
const app = express();
const path = require('path')
app.use(cors())
mongoose.connect('mongodb://mongodb:27017/movies').then(()=>{
    console.log('db connectd');
    app.listen(5050, () => {
        console.log('Server Running on 5050')
      });
}).catch((error)=>{
    console.error(error)
})
require('./auth/auth');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../front-end/dist')));
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/api/user', passport.authenticate('jwt', { session: false }), secureRoute);
app.get("/*",(req,res)=>{
  res.sendFile(path.join(__dirname+'/../front-end/dist/index.html'))
})
// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

