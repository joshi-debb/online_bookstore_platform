// Cargar las variables de entorno desde el archivo .env
const express = require("express");
const authorRoutes = require("./routes/authorRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const saleRoutes = require("./routes/saleRoutes");
const usersRouter = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/users", usersRouter);



app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
