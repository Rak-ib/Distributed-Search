const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());
app.use("/api", bookRoutes);

mongoose.connect("mongodb://mongo:27017/booksDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Server 2 connected to MongoDB"));

app.listen(4002, () => console.log("Server 2 running on port 4002"));
