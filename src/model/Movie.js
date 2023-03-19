const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    id: { type: Number, required: true ,},
    title: { type: String, require: true },
    releaseDate: { type: String, require: true },
    voteAverage: { type: Number, require: true },
    posterPath: String,
    list:String
})

const MovieModel = mongoose.model('movie', MovieSchema);
module.exports = MovieModel