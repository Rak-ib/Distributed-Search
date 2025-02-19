const Book = require("../models/bookModel");

exports.getBooks = async (req, res) => {
    try {
        const { title } = req.query;
        const query = title 
            ? { title: { $regex: title, $options: "i" }, id: { $gt: 2 } } 
            : { id: { $gt: 2 } };

        const books = await Book.find(query);

        // Add "source": "server2" to each book
        const booksWithSource = books.map(book => ({
            ...book.toObject(),
            source: "server2"
        }));

        res.json({ message: "Books retrieved", books: booksWithSource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
