const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const cors = require("cors");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/fields", require("./routes/fieldRoutes"));
app.use("/api/frameworks", require("./routes/frameworkRoutes"));
app.use("/api/turns", require("./routes/turnsRoutes"));
app.use(errorHandler);

app.listen(PORT, () => {
   console.log("server running on PORT:", PORT);
});

module.exports = app;
