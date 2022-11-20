const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require('dotenv').config()
const contactsRouter = require("./routes/api/contactsRoute");
const authRouter = require("./routes/api/authRoute");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter)
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.message.includes('required')) {
    return res.status(400).json({
      message: err.message
    })
  }
  if (err.message.includes('duplicate key error collection')) {
    return res.status(409).json({
         message: "Email in use"
       })
  }
  if (err.status) {
    return res.status(err.status).json({
      message: err.message
    })
  }
  res.status(500).json({ message:err.message });
});

module.exports = app;
