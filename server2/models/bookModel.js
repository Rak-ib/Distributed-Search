const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: Number,
    title: String,
    category: String
});

module.exports = mongoose.model("Book", bookSchema);
