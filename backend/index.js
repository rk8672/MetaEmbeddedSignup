const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();


app.use(cors());
app.use(express.json()); // Handles application/json
app.use(express.urlencoded({ extended: true })); // Handles form data

const dataConnection = require("./config/db.js");
dataConnection();

const whatsappWebhook=require('./webhook/whatsappWebhook');

app.use('/webhook',whatsappWebhook)

//Index Route
const main = require("./routes/index.js");
app.use('/api', main);

app.get('/', (req, res) => {
    res.send("Hello from Backend Team - Radha Krishna Singh");
})



const port = process.env.PORT || 10000; 

app.listen(port, () => {
    console.log(` Radha Krishna Singh Server is up and running on ${port}`)
})
