const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
    title: String,
    duration: String, 
    posterUrl: String, 
    sdUrl: String,
    hdUrl: String,
    downloadUrl: String
});

module.exports = mongoose.model('Show', ShowSchema);