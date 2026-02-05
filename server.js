/* =================================================
   IMPORTS
================================================= */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');
const sendMail = require("./utils/sendMail");

dotenv.config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');


/* =================================================
   INIT
================================================= */

const app = express();


/* =================================================
   DATABASE (MongoDB)
================================================= */

const connectDB = require("./config/db");

// ⭐ connect Mongo first
connectDB();


/* =================================================
   MIDDLEWARES
================================================= */

app.use(cors());

app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data


/* =================================================
   ROUTES
================================================= */

// 🔐 Authentication (register, login, forgot, reset, activate)
app.use("/auth", require("./routes/authRoutes"));

// 📁 Files (upload, folders, delete, rename)
app.use("/files", require("./routes/fileRoutes"));


/* =================================================
   HEALTH CHECK (optional but useful)
================================================= */

app.get("/", (req, res) => {
  res.send("🚀 API running successfully");
});
app.get("/mail-test", async (req, res) => {
  await sendMail(
    "yourpersonalemail@gmail.com",
    "Test Mail 🚀",
    "Hello Charan! Email working from Render 🎉"
  );

  res.send("Mail sent (check inbox)");
});

/* =================================================
   SERVER START
================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

