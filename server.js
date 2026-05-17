const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());   // ✅ only once

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tweets", require("./routes/tweet"));
app.use("/api/users", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

// Connect DB then start server
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => {
  console.log("MongoDB Connected ✅");

  app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
  });

})
.catch(err => console.log("MongoDB Error:", err));