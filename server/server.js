const path=require("path");
const express=require("express");

const app=express();

app.use(express.static(path.join(__dirname,"/../public")))


const port=process.env.Port || 3000;
app.listen(port,()=>{
    console.log(`Server started at ${port}`);
})


//console.log(path.join(__dirname,"/../public"));