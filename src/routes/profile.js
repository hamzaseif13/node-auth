const express = require('express');
const MovieModel = require('../model/Movie')
const UserModel = require('../model/User')
const router = express.Router();

router.get('/profile', async (req, res) => {
  try{
    const user = await UserModel.findById(req.user._id).populate("savedMovies")
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        savedMovies: user.savedMovies,
        name:user.name
      }
    })
  }catch(error){
    res.status(500).json({error:error.message})
  }
  
}
);

router.post('/save-movie', async (req, res) => {
  const movie = req.body.movie;
  // check if we want to add or remove the movie from the list
  const add = req.body.add
  if (add) {
    try {
      //removing movie from list
      await MovieModel.deleteOne({ id: movie.id,list:movie.list})
      const user = await UserModel.findOne({ _id: req.user._id }).populate("savedMovies")
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  else {
    try {
      // adding movie to list
      const newMovie = await MovieModel.create({ ...movie})
      const user = await UserModel.findByIdAndUpdate({ _id: req.user._id },
        { $push: { savedMovies: newMovie._id } }, { new: true }).populate("savedMovies")
      res.status(201).json(user)
    }
    catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
})

module.exports = router;