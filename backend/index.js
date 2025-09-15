import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser"; // (not needed if only using express.json / urlencoded)
import dataConnection from "./config/db.js";
import mainRouter from "./routes/index.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Connect to DB
dataConnection();

// Routes
app.use("/api", mainRouter);


app.get("/", (req, res) => {
  res.send("Hello from Backend Team - Radha Krishna Singh");
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(` Radha Krishna Singh Server is up and running on port ${port}`);
});
