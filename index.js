const express=require("express");
const app=express();

//connection for databse
const database=require("./configs/database");
const cors=require("cors");
// const { cloudinaryConnect }=require("./configs/cloudinary");
const dotenv=require("dotenv");
const { analyticsRouter } = require("./routes/analytics.routes");
const { watchEvents } = require("./ws/eventWatcher");
const { initializeAnalytics } = require("./utils/cache");

dotenv.config();

//port no
const PORT=process.env.PORT || 4003;

//connect
database.connect();


//cloudinary connect
// cloudinaryConnect();
 
//to parse json
app.use(express.json());

//establishing connection between frontend and backend through cors
app.use(
    cors({
        origin:"*",
        // origin:"http://localhost:3000",
        credentials:true
    })
);

app.use("/analytics", analyticsRouter);

//default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Analytics Service running!"
    })
});


//Activate server

app.listen(PORT,async ()=>{
    await initializeAnalytics();
    console.log(`App is running at ${PORT}`)
    watchEvents();
})


