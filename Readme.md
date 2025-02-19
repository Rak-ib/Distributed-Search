
# **Distributed Book Search Engine with Gateway API**

## **📌 Project Overview**
This project demonstrates a **distributed book search system** using **Node.js, Express, and MongoDB**. The goal is to:
- Search books from a same database but by using  **two different servers** (`server1` and `server2`).
- Use a **gateway server** to coordinate and aggregate search results.
- Implement **Docker and Docker Compose** to containerize and run the system efficiently.

Each server search n/2 books in a **partitioned manner**:
- `server1`: Search books where `id ≤ n/2`
- `server2`: Search books where `id > n/2`
- The **gateway server** queries both servers and combines the results.

---

## **📂 Project File Structure**
```
/distributed-search
│── /server1
│   ├── controllers/bookController.js
│   ├── models/bookModel.js
│   ├── routes/bookRoutes.js
│   ├── server.js
│── /server2
│   ├── controllers/bookController.js
│   ├── models/bookModel.js
│   ├── routes/bookRoutes.js
│   ├── server.js
│── /gateway
│   ├── models/bookModel.js
│   ├── gatewayServer.js
│── docker-compose.yml
│── README.md
│── swagger.yaml
│── package.json
│── .dockerignore
│── .gitignore
```

---

## **📘 Example Book Schema & Data**
Each book has the following **schema**:

```javascript
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: Number,
    title: String,
    category: String
});

module.exports = mongoose.model("Book", bookSchema);
```

### **📖 Sample Books in Databases**
 ID  | Title  | Category  |
-----|--------|-----------|
 1  | "The Hobbit" | Fantasy |
 2  | "Harry Potter" | Fantasy |
 3 | "Dune" | Sci-Fi |
 4 | "1984" | Dystopian |

---

## **🖥 Server Implementations**
Each **server** (`server1`, `server2`) runs an Express API that:
- Connects to **MongoDB**
- Allows searching for books in **its range**
- Returns books **along with the server name**

### **📝 `server1/server.js`**
```javascript
const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());

mongoose.connect........

app.use("/api", bookRoutes);
...........
app.listen(4001, () => console.log("Server1 running on port 4001"));
```

### **📝 `server2/server.js`**
```javascript
const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());

mongoose.connect......

app.use("/api", bookRoutes);
........
app.listen(4002, () => console.log("Server2 running on port 4002"));
```

---

## **🚀 Gateway Server**
The **gateway server**:
1. Queries both `server1` and `server2` when searching for books.
2. Merges the results into a single response.
3. Indicates which **server found the book**.

### **📝 `gateway/gatewayServer.js`**
```javascript
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect........
// Distributed Search
app.get("/search", async (req, res) => {
    try {
        const { title } = req.query;

        const [server1Res, server2Res] = await Promise.all([
            axios.get("http://server1:4001/api/books", { params: { title } }),
            axios.get("http://server2:4002/api/books", { params: { title } }),
        ]);

        const server1Books = server1Res.data.books.map(book => ({ ...book, source: "server1" }));
        const server2Books = server2Res.data.books.map(book => ({ ...book, source: "server2" }));

        res.json({ books: [...server1Books, ...server2Books] });
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});
.........

app.listen(5000, () => console.log("Gateway running on port 5000"));
```

---

## **🛠️ How to Set Up the Project**
### **1️⃣ Install Dependencies**
```bash
npm install
```

### **2️⃣ Dockerize the Project**
Each service (`server1`, `server2`, and `gateway`) will run inside a **Docker container**.

### **3️⃣ Run the Project with Docker Compose**
```bash
docker-compose up --build
```

---

## **📜 Docker Compose File (`docker-compose.yml`)**
```yaml
version: "3.8"

services:
  mongo1:
    image: mongo
    container_name: mongo1
    ports:
      - "27018:27017"

  mongo2:
    image: mongo
    container_name: mongo2
    ports:
      - "27019:27017"

  mongo_gateway:
    image: mongo
    container_name: mongo_gateway
    ports:
      - "27020:27017"

  server1:
    build: ./server1
    container_name: server1
    ports:
      - "4001:4001"
    depends_on:
      - mongo1

  server2:
    build: ./server2
    container_name: server2
    ports:
      - "4002:4002"
    depends_on:
      - mongo2

  gateway:
    build: ./gateway
    container_name: gateway
    ports:
      - "5000:5000"
    depends_on:
      - server1
      - server2
```

### **🛠 Explanation**
- `mongo1`, `mongo2`, and `mongo_gateway`: MongoDB containers for each service.
- `server1` & `server2`: Book storage servers.
- `gateway`: Main server handling search queries.
- `depends_on`: Ensures MongoDB starts before the app servers.

---

## **🛠 API Endpoints**
### **1️⃣ Add a New Book**
**`POST /books`**
```json
{
  "id": 5,
  "title": "Harry Potter",
  "category": "Fantasy"
}
```
📌 **Response:** `"Book added successfully"`

---

### **2️⃣ Search for a Book**
**`GET /search?title=Harry`**
📌 **Response**
```json
{
  "books": [
    {
      "id": 5,
      "title": "Harry Potter",
      "category": "Fantasy",
      "searchedBy": "server1"
    }
  ]
}
```

---

## **🎯 Conclusion**
This **Distributed Book Search Engine**:
✔️ Uses **multiple servers** for better scalability.  
✔️ Implements **Docker & Compose** for easy deployment.  
✔️ Utilizes **Express & MongoDB** for efficient data management.  

