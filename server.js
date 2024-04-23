require('dotenv').config()
const express = require("express");
const app = express();
const connectDB = require('./config/connect');
const cors = require('cors');
// const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const userRouter = require('./routes/userRouter');
const pdfRouter = require('./routes/pdfRouter')


connectDB(process.env.MONGO_URL);

//MiddleWare
app.use(cors());
app.use(express.json());

//Router
app.use("/api/user/", userRouter);
app.use("/api/pdf", pdfRouter);

const PORT = process.env.PORT || 8080;

mongoose.connection.once("open", () => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => console.log(`server running on port ${PORT}...`));
  });
  
mongoose.connection.on("error", (err) => {
    console.log(err);
  });
  




