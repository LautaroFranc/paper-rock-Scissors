const express = require('express')
const morgan = require('morgan')
const cors =require("cors")


const app = express()
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(morgan("dev"))
app.use(cors({origin: "*"}))

app.get("/", (req, res)=>{
res.send("hi, welcome to my server!");
})

module.exports = app