const express=require('express');
const app=express();
const dotenv=require('dotenv').config();
const PORT=process.env.PORT;
const path=require('path')
const connectDb=require('./config/database');
const cookieParser=require('cookie-parser')
const cors=require('cors');
const routes=require('./router')
app.use(cors());

connectDb();
app.use(express.json());
app.use(cookieParser());
app.use('/api',routes);
app.use(express.static(path.join(__dirname, "avatar")));
app.use(express.static(path.join(__dirname, "audio")));
app.use(express.static(path.join(__dirname, "video")));
app.use(express.static(path.join(__dirname, "file")));
app.use('*',(req,res)=>{
    res.status(404).json('Api endpoint not Found')
});

app.listen(PORT,()=>{
    console.log(`Server is up and running on ${PORT}`)
});