const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const secureRoute = require('./routes/profile');
const cors = require('cors')
const path = require('path')
const config = require('./config')


const PORT = process.env.PORT || 5050
const app = express();



// initializing passport
app.use(passport.initialize())
require('./auth/auth')(passport);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static(path.join(__dirname, '../front-end/dist')));

// routes
app.use('/api', authRoutes);
app.use('/api', passport.authenticate('jwt', { session: false }), secureRoute);


// serve the front-end when in production
if (process.env.NODE_ENV === "production") {
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname + '/../front-end/dist/index.html'))
  })
}

// starting the server
async function start() {
  try {
    await mongoose.connect(config.mongoURL)
    console.log("db connected");
    app.listen(PORT, () => console.log("server listening on " + PORT))

  } catch (error) {
    console.error(error)
  }
}

start();
