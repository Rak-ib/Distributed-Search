const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Book = require("./models/bookModel");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
  .connect("mongodb://mongo:27017/booksDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Gateway connected to MongoDB"));

// ✅ POST a book (Data will be stored in MongoDB)
app.post("/books", async (req, res) => {
    try {
        const { id, title, category } = req.body;
        const book = new Book({ id, title, category });
        await book.save();
        res.status(201).json({ message: "Book added successfully", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET books by name (Distributed Search)
// ✅ GET books by name (Distributed Search)
app.get("/search", async (req, res) => {
    try {
        const { title } = req.query;

        const [server1Res, server2Res] = await Promise.all([
            axios.get("http://server1:4001/api/books", { params: { title } }),
            axios.get("http://server2:4002/api/books", { params: { title } }),
        ]);

        // Extract the books array from both responses
        const server1Books = server1Res.data.books || [];
        const server2Books = server2Res.data.books || [];

        // Combine all books
        const allBooks = [...server1Books, ...server2Books];

        res.json({ message: "Books retrieved", books: allBooks });
    } catch (error) {
        console.error("Error fetching books:", error.message);
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.get("/",async(req,res)=>{
    res.send("hello world");
})

app.listen(5000, () => console.log("Gateway running on port 5000"));
