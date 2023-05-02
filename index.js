const express= require("express");

const {connection}= require("./Config/db");
const {APIRouter}= require("./Router/api.router")
require("dotenv").config();
const cors= require("cors")
const app= express();
app.use(cors())
app.use(express.json());
app.use("/api",APIRouter)
app.get("/",(req,res)=>{
    res.send("Home")
})

app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("Connected to DB")
        console.log(`server is running on ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
})

