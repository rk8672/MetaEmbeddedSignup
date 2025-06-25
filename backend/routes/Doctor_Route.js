const express=require('express');
const route=express.Router();

const {createDoctor}=require("../controllers/Doctor_Controller");

route.post("/CreateDoctor",createDoctor);
module.exports=route;