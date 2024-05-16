const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

require("dotenv").config();




const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json({}));
app.use(morgan("dev"))
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/gym", require("./routes/gym"));
app.use("/api/packages", require("./routes/package"));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
