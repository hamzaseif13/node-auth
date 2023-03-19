const express = require('express');
const MovieModel = require('../model/Movie')
const UserModel = require('../model/User')
const router = express.Router();

router.get('/profile', async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate("moviesWatchlist").populate("moviesHistory")
  res.json({
    user: {
      _id: user._id,
      email: user.email,
      moviesWatchlist: user.moviesWatchlist,
      moviesHistory: user.moviesHistory
    }
  })
}
);

router.post('/add-watchlist', async (req, res) => {
  const movie = req.body.movie;
  const add = req.body.add
  if (add) {
    try{
       await MovieModel.deleteOne({id:movie.id,list:"watchList"})
      const user = await UserModel.findOne({_id:req.user._id}).populate("moviesWatchlist").populate("moviesHistory")
      res.json(user)
    }catch(error){
      res.status(500).json({message:error.message})
    }
    
  }
  else {
    try {
      const newMovie = await MovieModel.create({ ...movie,list:"watchList" })
      const user = await UserModel.findByIdAndUpdate({ _id: req.user._id }, { $push: { moviesWatchlist: newMovie._id } }, { new: true }).populate("moviesWatchlist").populate("moviesHistory")
      res.status(201).json(user)
    }
    catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
})

router.post('/add-history', async (req, res) => {
  const movie = req.body.movie;
  const add = req.body.add
  if (add) {
    try{
       await MovieModel.deleteOne({id:movie.id,list:"history"})
      const user = await UserModel.findOne({_id:req.user._id}).populate("moviesWatchlist").populate("moviesHistory")
      res.json(user)
    }catch(error){
      res.status(500).json({message:error.message})
    }
    
  }
  else {
    try {
      const newMovie = await MovieModel.create({ ...movie,list:"history" })
      const user = await UserModel.findByIdAndUpdate({ _id: req.user._id }, { $push: { moviesHistory: newMovie._id } }, { new: true }).populate("moviesWatchlist").populate("moviesHistory")
      res.status(201).json(user)
    }
    catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
})

module.exports = router;