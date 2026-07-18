const express = require('express');
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors=require("cors")
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

const interviewRouter=require("./routes/interview.routes");
app.use("/api/interview",interviewRouter)
app.use("/api/auth", authRouter);

module.exports = app;